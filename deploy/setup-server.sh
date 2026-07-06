#!/usr/bin/env bash
set -euo pipefail

# Initial Digital Ocean droplet setup for Health Hub at kundankrishna.tech/healthhub
# Run as root: bash setup-server.sh

export DEBIAN_FRONTEND=noninteractive

echo "==> Updating Ubuntu packages..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git nginx ufw certbot python3-certbot-nginx mysql-server build-essential

echo "==> Installing Node.js 20 LTS..."
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "==> Installing PM2..."
npm install -g pm2

echo "==> Configuring MySQL..."
systemctl enable mysql
systemctl start mysql

DB_NAME="health_food_assistant"
DB_USER="healthhub"

if [[ -f /opt/health-hub/server.env ]]; then
  # shellcheck disable=SC1091
  source /opt/health-hub/server.env
fi

DB_PASS="${MYSQL_PASSWORD:-$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"

mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

echo "==> Creating app directories..."
mkdir -p /var/www/kundankrishna/healthhub
mkdir -p /opt/health-hub
chown -R www-data:www-data /var/www/kundankrishna

echo "==> Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

cat >/opt/health-hub/server.env <<EOF
PORT=4000
NODE_ENV=production
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=${DB_USER}
MYSQL_PASSWORD=${DB_PASS}
MYSQL_DATABASE=${DB_NAME}
JWT_SECRET=${JWT_SECRET}
PUBLIC_APP_URL=https://kundankrishna.tech/healthhub
EOF
chmod 600 /opt/health-hub/server.env
mkdir -p /opt/health-hub/server
cp /opt/health-hub/server.env /opt/health-hub/server/.env
chmod 600 /opt/health-hub/server/.env

cp "$(dirname "$0")/health-hub-api.service" /etc/systemd/system/health-hub-api.service
systemctl daemon-reload
systemctl enable health-hub-api

NGINX_SNIPPET="/etc/nginx/snippets/healthhub.conf"
cp "$(dirname "$0")/nginx-healthhub.conf" "${NGINX_SNIPPET}"

# Ensure main site includes the snippet
MAIN_CONF="/etc/nginx/sites-available/kundankrishna.tech"
if [[ ! -f "${MAIN_CONF}" ]]; then
  cp "$(dirname "$0")/nginx-kundankrishna.tech.conf" "${MAIN_CONF}"
  ln -sf "${MAIN_CONF}" /etc/nginx/sites-enabled/kundankrishna.tech
  rm -f /etc/nginx/sites-enabled/default
else
  if ! grep -q 'snippets/healthhub.conf' "${MAIN_CONF}"; then
    sed -i '/server_name.*kundankrishna.tech/a \    include snippets/healthhub.conf;' "${MAIN_CONF}" 2>/dev/null || \
    echo '    include snippets/healthhub.conf;' >> "${MAIN_CONF}"
  fi
fi

nginx -t
systemctl reload nginx

echo ""
echo "=============================================="
echo " Server setup complete."
echo " MySQL user: ${DB_USER}"
echo " MySQL pass: ${DB_PASS}"
echo " JWT_SECRET saved in /opt/health-hub/server.env"
echo " Next: run deploy.sh from your dev machine"
echo "=============================================="
