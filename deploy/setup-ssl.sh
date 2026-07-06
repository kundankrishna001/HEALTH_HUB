#!/bin/bash
set -e
certbot --nginx \
  -d kundankrishna.tech \
  -d www.kundankrishna.tech \
  --non-interactive \
  --agree-tos \
  --register-unsafely-without-email \
  --redirect
nginx -t
systemctl reload nginx
echo "SSL_OK"
curl -sf https://kundankrishna.tech/healthhub/api/health
echo
curl -sI https://kundankrishna.tech/healthhub/ | head -5
