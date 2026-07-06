#!/bin/bash
set -e
source /opt/health-hub/server.env
mysql -e "ALTER USER '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';"
mysql -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'localhost'; FLUSH PRIVILEGES;"
cp /opt/health-hub/server.env /opt/health-hub/server/.env
systemctl restart health-hub-api
sleep 2
systemctl is-active health-hub-api
curl -sf http://127.0.0.1:4000/api/health
echo
