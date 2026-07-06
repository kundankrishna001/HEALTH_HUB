#!/bin/bash
set -e
mysql -e "DROP USER IF EXISTS 'healthhub'@'localhost';"
mysql -e "CREATE USER 'healthhub'@'localhost' IDENTIFIED BY 'RpTzNbxQmI1VYmXZCFBTQ2Kz';"
mysql -e "CREATE DATABASE IF NOT EXISTS health_food_assistant;"
mysql -e "GRANT ALL PRIVILEGES ON health_food_assistant.* TO 'healthhub'@'localhost'; FLUSH PRIVILEGES;"
systemctl restart health-hub-api
sleep 3
systemctl is-active health-hub-api
curl -sf http://127.0.0.1:4000/api/health
echo
