#!/usr/bin/env bash
# Añade panel.metodosynesis.com a Caddy (HTTPS automático).
# - Sirve /srv/sites/panel.metodosynesis.com, que ya gestiona el conector
# - Cualquier ruta cae en index.html (la app decide qué pantalla mostrar)
# - Nunca indexable por buscadores
# - Si la configuración nueva no es válida, se restaura la anterior y las webs siguen igual
set -uo pipefail
DOMINIO=panel.metodosynesis.com
RAIZ=/srv/sites/$DOMINIO
fallo() { echo "FALLO: $1"; exit 1; }

[ "$(id -u)" = "0" ] || fallo "ejecútalo como root"
mkdir -p "$RAIZ"

cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak
if grep -q "^$DOMINIO" /etc/caddy/Caddyfile; then
  echo "Ya estaba en Caddy; no cambio nada."
else
  cat >> /etc/caddy/Caddyfile <<EOF

$DOMINIO {
  root * $RAIZ
  encode gzip
  header {
    X-Robots-Tag "noindex, nofollow"
    X-Frame-Options "DENY"
    Referrer-Policy "strict-origin-when-cross-origin"
    X-Content-Type-Options "nosniff"
  }
  try_files {path} /index.html
  file_server
}
EOF
fi

if caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile > /dev/null 2>&1; then
  systemctl reload caddy
else
  cp /etc/caddy/Caddyfile.bak /etc/caddy/Caddyfile
  fallo "la configuración de Caddy no es válida; restaurada la anterior (las webs siguen igual)"
fi

echo "Esperando el certificado HTTPS (hasta 1 minuto)..."
for i in $(seq 1 20); do
  if curl -sf "https://$DOMINIO/" > /dev/null; then
    echo "OK: https://$DOMINIO funciona."
    exit 0
  fi
  sleep 3
done
echo "AVISO: Caddy está configurado pero el HTTPS aún no responde. Revisa: journalctl -u caddy -n 30"
