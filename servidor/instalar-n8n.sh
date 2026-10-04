#!/bin/bash
# Instala n8n en el servidor Synesis (https://n8n.metodosynesis.com)
# - n8n con su propio Node 24 en /opt (no toca el Node del sistema ni el conector)
# - servicio systemd con usuario propio, escuchando solo en local
# - Caddy le pone HTTPS; si la configuración de Caddy falla, se restaura la anterior
set -uo pipefail
N8N_VERSION=2.41.6
DOMINIO=n8n.metodosynesis.com
fallo() { echo "FALLO: $1"; exit 1; }

echo "== 1/6 Descargando Node 24 para n8n"
case "$(uname -m)" in x86_64) NA=x64 ;; aarch64) NA=arm64 ;; *) fallo "arquitectura no soportada" ;; esac
BASE=https://nodejs.org/dist/latest-v24.x
TMP=$(mktemp -d)
cd "$TMP" || fallo "sin carpeta temporal"
curl -fsSLO "$BASE/SHASUMS256.txt" || fallo "no se pudo descargar la lista de Node"
F=$(grep -o "node-v24[^ ]*-linux-$NA\.tar\.xz" SHASUMS256.txt | head -1)
[ -n "$F" ] || fallo "no se encontró Node 24 para $NA"
curl -fsSLO "$BASE/$F" || fallo "no se pudo descargar Node"
grep " $F\$" SHASUMS256.txt | sha256sum -c - > /dev/null || fallo "Node descargado no verifica"
rm -rf /opt/node24 && mkdir -p /opt/node24
tar -xJf "$F" -C /opt/node24 --strip-components=1 || fallo "no se pudo descomprimir Node"
echo "   Node $(/opt/node24/bin/node -v)"

echo "== 2/6 Usuario y carpetas"
id n8n > /dev/null 2>&1 || useradd --system --home /var/lib/n8n --create-home --shell /usr/sbin/nologin n8n
mkdir -p /opt/n8n /var/lib/n8n
chown n8n:n8n /opt/n8n /var/lib/n8n

echo "== 3/6 Instalando n8n $N8N_VERSION (tarda unos minutos)"
sudo -u n8n env HOME=/var/lib/n8n PATH=/opt/node24/bin:/usr/bin:/bin \
  npm install --prefix /opt/n8n --no-audit --no-fund --loglevel=error "n8n@$N8N_VERSION" \
  || fallo "npm no pudo instalar n8n"
[ -x /opt/n8n/node_modules/.bin/n8n ] || fallo "n8n no quedó instalado"

echo "== 4/6 Configuración"
if [ ! -f /etc/n8n.env ]; then
  KEY=$(openssl rand -hex 32)
  cat > /etc/n8n.env <<EOF
N8N_ENCRYPTION_KEY=$KEY
N8N_HOST=$DOMINIO
N8N_PROTOCOL=https
N8N_PORT=5678
N8N_LISTEN_ADDRESS=127.0.0.1
N8N_PROXY_HOPS=1
WEBHOOK_URL=https://$DOMINIO/
N8N_EDITOR_BASE_URL=https://$DOMINIO/
GENERIC_TIMEZONE=Europe/Madrid
TZ=Europe/Madrid
N8N_DIAGNOSTICS_ENABLED=false
N8N_PERSONALIZATION_ENABLED=false
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=336
NODE_OPTIONS=--max-old-space-size=1536
EOF
fi
chown root:n8n /etc/n8n.env && chmod 640 /etc/n8n.env

cat > /etc/systemd/system/n8n.service <<'EOF'
[Unit]
Description=n8n
After=network-online.target
[Service]
User=n8n
Group=n8n
EnvironmentFile=/etc/n8n.env
Environment=PATH=/opt/node24/bin:/usr/bin:/bin
Environment=HOME=/var/lib/n8n
WorkingDirectory=/var/lib/n8n
ExecStart=/opt/n8n/node_modules/.bin/n8n start
Restart=always
RestartSec=5
NoNewPrivileges=true
ProtectSystem=full
ProtectHome=true
PrivateTmp=true
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now n8n > /dev/null 2>&1

echo "== 5/6 HTTPS con Caddy"
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak
if ! grep -q "^$DOMINIO" /etc/caddy/Caddyfile; then
  printf '\n%s {\n  reverse_proxy 127.0.0.1:5678\n}\n' "$DOMINIO" >> /etc/caddy/Caddyfile
fi
if caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile > /dev/null 2>&1; then
  systemctl reload caddy
else
  cp /etc/caddy/Caddyfile.bak /etc/caddy/Caddyfile
  fallo "la configuración de Caddy no es válida; restaurada la anterior (las webs siguen igual)"
fi

echo "== 6/6 Comprobando que n8n arranca (hasta 2 minutos)"
for i in $(seq 1 40); do
  if curl -sf http://127.0.0.1:5678/healthz > /dev/null; then
    rm -rf "$TMP" /srv/sites/upd
    echo "OK: n8n instalado. Abre https://$DOMINIO y crea tu usuario."
    exit 0
  fi
  sleep 3
done
echo "AVISO: n8n no responde todavía. Mira el estado con: journalctl -u n8n -n 30"
exit 1
