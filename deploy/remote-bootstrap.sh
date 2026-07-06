#!/usr/bin/env bash
# Paste this entire script into the Digital Ocean Droplet Console (Access > Launch Droplet Console)
# as root. It updates Ubuntu, installs dependencies, and deploys Health Hub.
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
REPO_URL="${REPO_URL:-https://github.com/kundankrishna001/HEALTHCHECK26.git}"
APP_DIR="/opt/health-hub"
WEB_ROOT="/var/www/kundankrishna/healthhub"

echo "==> Updating Ubuntu..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git nginx ufw certbot python3-certbot-nginx mysql-server build-essential

echo "==> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "==> Configuring MySQL..."
systemctl enable mysql
systemctl start mysql

DB_NAME="health_food_assistant"
DB_USER="healthhub"
DB_PASS="$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)"
JWT_SECRET="$(openssl rand -hex 32)"

mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

echo "==> Cloning application..."
rm -rf "${APP_DIR}"
git clone "${REPO_URL}" "${APP_DIR}"
cd "${APP_DIR}"

cat >.env.production <<EOF
VITE_BASE_PATH=/healthhub/
VITE_API_BASE_URL=/healthhub/api
EOF

mkdir -p server
cat >server/.env <<EOF
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
chmod 600 server/.env

npm ci
npm run build

mkdir -p "${WEB_ROOT}"
cp -r dist/* "${WEB_ROOT}/"
chown -R www-data:www-data /var/www/kundankrishna

echo "==> Configuring nginx..."
mkdir -p /var/www/kundankrishna/html
cat >/etc/nginx/snippets/healthhub.conf <<'NGINX'
location /healthhub/api/ {
    proxy_pass http://127.0.0.1:4000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
location /healthhub/ {
    root /var/www/kundankrishna;
    try_files $uri $uri/ /healthhub/index.html;
}
location = /healthhub {
    return 301 /healthhub/;
}
NGINX

if [[ ! -f /etc/nginx/sites-available/kundankrishna.tech ]]; then
cat >/etc/nginx/sites-available/kundankrishna.tech <<'SITE'
server {
    listen 80;
    listen [::]:80;
    server_name kundankrishna.tech www.kundankrishna.tech;
    root /var/www/kundankrishna/html;
    index index.html;
    include snippets/healthhub.conf;
    location / {
        try_files $uri $uri/ =404;
    }
}
SITE
  ln -sf /etc/nginx/sites-available/kundankrishna.tech /etc/nginx/sites-enabled/kundankrishna.tech
  rm -f /etc/nginx/sites-enabled/default
else
  grep -q 'snippets/healthhub.conf' /etc/nginx/sites-available/kundankrishna.tech || \
    sed -i '/server_name/a \    include snippets/healthhub.conf;' /etc/nginx/sites-available/kundankrishna.tech
fi

nginx -t
systemctl reload nginx

echo "==> Configuring API service..."
cat >/etc/systemd/system/health-hub-api.service <<'UNIT'
[Unit]
Description=Health Hub API
After=network.target mysql.service
Wants=mysql.service
[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/health-hub
EnvironmentFile=/opt/health-hub/server/.env
ExecStart=/usr/bin/node /opt/health-hub/server/index.js
Restart=on-failure
RestartSec=5
[Install]
WantedBy=multi-user.target
UNIT

chown -R www-data:www-data "${APP_DIR}"
systemctl daemon-reload
systemctl enable health-hub-api
systemctl restart health-hub-api

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "=============================================="
echo " Health Hub deployed!"
echo " URL: http://kundankrishna.tech/healthhub"
echo " MySQL user: ${DB_USER}"
echo " MySQL pass: ${DB_PASS}"
echo ""
echo " DNS: Point kundankrishna.tech A record to this server IP"
echo " SSL: certbot --nginx -d kundankrishna.tech -d www.kundankrishna.tech"
echo "=============================================="
curl -sf http://127.0.0.1:4000/api/health && echo ""
