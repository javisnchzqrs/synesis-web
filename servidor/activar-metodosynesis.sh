#!/usr/bin/env bash
# Sirve metodosynesis.com desde este servidor (adiós WordPress).
# - Sirve /srv/sites/metodosynesis.com (home, recursos del curso, legales, fotos en /wp-content/uploads/)
# - www.metodosynesis.com redirige a metodosynesis.com
# - Las páginas viejas del embudo de WordPress redirigen (301) a su equivalente nuevo
# - Lo que ya no existe (auditorías antiguas, horarios) da la página 404
# - Si la configuración nueva no es válida, se restaura la anterior y las webs siguen igual
# Requisito: los registros A de metodosynesis.com y www apuntan a este servidor (los MX del correo no se tocan).
set -uo pipefail
DOMINIO=metodosynesis.com
RAIZ=/srv/sites/$DOMINIO
APP=https://app.metodosynesis.com
fallo() { echo "FALLO: $1"; exit 1; }

[ "$(id -u)" = "0" ] || fallo "ejecútalo como root"
[ -f "$RAIZ/index.html" ] || fallo "falta $RAIZ/index.html (pide a Claude que publique la home primero)"

cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak
if grep -q "^$DOMINIO" /etc/caddy/Caddyfile; then
  echo "Ya estaba en Caddy; no cambio nada."
else
  cat >> /etc/caddy/Caddyfile <<EOF

www.$DOMINIO {
  redir https://$DOMINIO{uri} 301
}

$DOMINIO {
  root * $RAIZ
  encode gzip
  header {
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
  }

  # Embudo antiguo de WordPress → embudo nuevo
  redir /rabietas-l1* $APP/rabietas/ 301
  redir /rabietas-l2* $APP/rabietas/ 301
  redir /no-obedece-l1* $APP/no-obedece/ 301
  redir /no-obedece-l2* $APP/no-obedece/ 301
  redir /pega-l1* $APP/pega/ 301
  redir /pega-l2* $APP/pega/ 301
  redir /landing-vsl* $APP/empieza/ 301
  redir /vsl* $APP/empieza/ 301
  redir /audit-lp-a* $APP/empieza/ 301
  redir /audit-lp-b* $APP/empieza/ 301
  redir /cuestionario-analisis* $APP/cuestionario/ 301
  redir /cuestionario-auditoria* $APP/cuestionario/ 301
  redir /reserva-llamada* $APP/reserva/ 301
  redir /pre-llamada* / 301
  redir /demo-synesis* / 301
  redir /home* / 301

  file_server
  handle_errors {
    @no_existe expression {err.status_code} == 404
    rewrite @no_existe /404.html
    file_server
  }
}
EOF
fi

if caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile > /dev/null 2>&1; then
  systemctl reload caddy
else
  cp /etc/caddy/Caddyfile.bak /etc/caddy/Caddyfile
  fallo "la configuración de Caddy no es válida; restaurada la anterior (las webs siguen igual)"
fi

echo "Caddy configurado. Esperando el certificado HTTPS (hasta 2 minutos; necesita que el DNS ya apunte aquí)..."
for i in $(seq 1 40); do
  if curl -sf "https://$DOMINIO/" > /dev/null; then
    echo "OK: https://$DOMINIO funciona."
    exit 0
  fi
  sleep 3
done
echo "AVISO: Caddy está listo pero el HTTPS aún no responde. Si acabas de cambiar el DNS, espera unos minutos: Caddy lo reintenta solo. Revisa: journalctl -u caddy -n 30"
