#!/usr/bin/env bash
# Luxira Scents — Hostinger KVM VPS Setup Script
# Ubuntu 22.04 LTS
# Run as root: curl -sL <url> | bash
# Or: chmod +x setup-vps.sh && sudo ./setup-vps.sh

set -euo pipefail
DEPLOY_USER="luxira"
APP_DIR="/var/www/luxira"
LOG_DIR="/var/log/pm2"

echo "=== Luxira Scents VPS Setup ==="

# Update system
apt-get update && apt-get upgrade -y
apt-get install -y curl wget gnupg2 software-properties-common ufw fail2ban

# Security: configure UFW
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Fail2ban for SSH protection
systemctl enable --now fail2ban

# Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2 turbo

# PostgreSQL 16
apt-get install -y postgresql postgresql-contrib
systemctl enable --now postgresql

# Create database and user
# IMPORTANT: Replace passwords before running. Do not run this script with defaults.
DB_PASSWORD="${DB_PASSWORD:-CHANGE_ME_STRONG_PASSWORD}"
sudo -u postgres psql <<SQL
  CREATE USER perfume_app WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';
  CREATE DATABASE perfume_store OWNER perfume_app;
  GRANT ALL PRIVILEGES ON DATABASE perfume_store TO perfume_app;
SQL

# PgBouncer for connection pooling
apt-get install -y pgbouncer
cat > /etc/pgbouncer/pgbouncer.ini <<CONF
[databases]
perfume_store = host=127.0.0.1 port=5432 dbname=perfume_store

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 200
default_pool_size = 20
min_pool_size = 5
reserve_pool_size = 5
server_idle_timeout = 300
log_connections = 0
log_disconnections = 0
CONF

# PgBouncer auth — use md5 hash of password (run: pg_md5 <password>)
echo '"perfume_app" "SCRAM-SHA-256-HASH-HERE"' > /etc/pgbouncer/userlist.txt
systemctl enable --now pgbouncer

# Redis 7
apt-get install -y redis-server
REDIS_PASSWORD="${REDIS_PASSWORD:-CHANGE_ME_REDIS_PASSWORD}"
sed -i "s/# requirepass foobared/requirepass ${REDIS_PASSWORD}/" /etc/redis/redis.conf
sed -i "s/bind 127.0.0.1 ::1/bind 127.0.0.1/" /etc/redis/redis.conf
systemctl enable --now redis-server

# Nginx
apt-get install -y nginx
systemctl enable --now nginx

# Certbot for SSL
apt-get install -y certbot python3-certbot-nginx
# Run after pointing DNS:
# certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Create deploy user
id -u ${DEPLOY_USER} &>/dev/null || useradd -m -s /bin/bash ${DEPLOY_USER}
mkdir -p "${APP_DIR}" "${LOG_DIR}"
chown -R ${DEPLOY_USER}:${DEPLOY_USER} "${APP_DIR}" "${LOG_DIR}"

# .pgpass for secure cron authentication (no plaintext password in cron)
# Format: host:port:database:user:password
DB_PASS_PGPASS="${DB_PASSWORD}"
PGPASS_FILE="/home/${DEPLOY_USER}/.pgpass"
echo "127.0.0.1:5432:perfume_store:perfume_app:${DB_PASS_PGPASS}" > "${PGPASS_FILE}"
chown ${DEPLOY_USER}:${DEPLOY_USER} "${PGPASS_FILE}"
chmod 0600 "${PGPASS_FILE}"

# Database backup cron (daily at 2am) — uses .pgpass for authentication
BACKUP_DIR="/var/backups/perfume_store"
mkdir -p "${BACKUP_DIR}"
chown ${DEPLOY_USER}:${DEPLOY_USER} "${BACKUP_DIR}"

crontab -u ${DEPLOY_USER} -l 2>/dev/null | cat - <(echo "0 2 * * * PGPASSFILE=${PGPASS_FILE} pg_dump -h 127.0.0.1 -U perfume_app perfume_store | gzip > ${BACKUP_DIR}/backup-\$(date +\%Y\%m\%d).sql.gz && find ${BACKUP_DIR} -mtime +7 -delete") | crontab -u ${DEPLOY_USER} -

# PM2 startup
sudo -u ${DEPLOY_USER} pm2 startup systemd -u ${DEPLOY_USER} --hp /home/${DEPLOY_USER}
pm2 startup systemd -u ${DEPLOY_USER} --hp /home/${DEPLOY_USER}

echo ""
echo "=== Setup complete ==="
echo "Next steps:"
echo "  1. Update passwords in /etc/pgbouncer/userlist.txt"
echo "  2. Point DNS to this VPS IP"
echo "  3. Run: certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "  4. Deploy app: cd ${APP_DIR} && git clone <repo> . && npm install"
echo "  5. Configure env files and run: pm2 start infra/pm2/ecosystem.config.js --env production"
