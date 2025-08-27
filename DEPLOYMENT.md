# 🚀 LoyaCareCRM Ubuntu Server Deployment Guide

*Complete deployment instructions for CRM system on clean Ubuntu server*

*[🇷🇺 Русский](DEPLOYMENT.ru.md) | 🇺🇸 English | [🇩🇪 Deutsch](DEPLOYMENT.de.md)*

## 📋 Prerequisites

### 1. System Update
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Required Packages
```bash
sudo apt install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

## 🗄️ PostgreSQL Installation and Setup

### 1. Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```

### 2. Configure PostgreSQL
```bash
# Start and enable auto-start
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user and database
sudo -u postgres psql
```

In PostgreSQL console execute:
```sql
CREATE USER loyacrm WITH PASSWORD 'your_strong_password';
CREATE DATABASE loyacrm OWNER loyacrm;
GRANT ALL PRIVILEGES ON DATABASE loyacrm TO loyacrm;
\q
```

### 3. Configure PostgreSQL Access
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```
Find and uncomment/modify:
```
listen_addresses = 'localhost'
```

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```
Add line:
```
local   loyacrm         loyacrm                                 md5
```

```bash
sudo systemctl restart postgresql
```

## 🟢 Node.js and npm Installation

### 1. Install Node.js 18+ via NodeSource
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Verify Installation
```bash
node --version
npm --version
```

### 3. Install PM2 for Process Management
```bash
sudo npm install -g pm2
```

## 🌐 Nginx Installation and Setup

### 1. Install Nginx
```bash
sudo apt install -y nginx
```

### 2. Start and Enable Auto-start
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📁 Application Deployment

### 1. Clone Repository
```bash
cd /var/www/
sudo git clone <your-repository-url> loyacrm
sudo chown -R $USER:$USER /var/www/loyacrm
cd loyacrm
```

### 2. Environment Variables Setup

#### Database:
```bash
cd db
nano .env
```
Contents of `.env`:
```env
DATABASE_URL="postgresql://loyacrm:your_strong_password@localhost:5432/loyacrm"
```

#### Backend:
```bash
cd ../backend
nano .env
```
Contents of `.env`:
```env
DATABASE_URL="postgresql://loyacrm:your_strong_password@localhost:5432/loyacrm"
JWT_SECRET="your_super_secret_jwt_key_here"
PORT=4000
NODE_ENV=production
```

#### Frontend:
```bash
cd ../frontend
nano .env.local
```
Contents of `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-server-ip:4000
```

### 3. Dependencies Installation and Database Initialization

#### Database:
```bash
cd /var/www/loyacrm/db
npm install
npx prisma migrate deploy
npx prisma generate
npm run generate
```

#### Backend:
```bash
cd ../backend
npm install
npm run build
```

#### Frontend:
```bash
cd ../frontend
npm install
npm run build
```

## 🚀 Launch Services with PM2

### 1. Create PM2 Configuration
```bash
cd /var/www/loyacrm
nano ecosystem.config.js
```

Contents of `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'loyacrm-backend',
      cwd: './backend',
      script: 'dist/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'loyacrm-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
```

### 2. Start Applications
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
⚠️ **Important:** Execute the command that `pm2 startup` outputs.

## 🌐 Configure Nginx as Reverse Proxy

### 1. Create Site Configuration
```bash
sudo nano /etc/nginx/sites-available/loyacrm
```

Configuration contents:
```nginx
server {
    listen 80;
    server_name your-domain.com your-server-ip;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js static files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 2. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/loyacrm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL Setup (Optional but Recommended)

### 1. Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

## 🛡️ Firewall Setup

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 🔧 Management Scripts Creation

### 1. Application Update Script
```bash
sudo nano /usr/local/bin/loyacrm-update.sh
```

Contents:
```bash
#!/bin/bash
cd /var/www/loyacrm

echo "Updating repository..."
git pull origin main

echo "Updating database..."
cd db
npm run generate

echo "Building backend..."
cd ../backend
npm install --production
npm run build

echo "Building frontend..."
cd ../frontend
npm install --production
npm run build

echo "Restarting services..."
pm2 restart all

echo "Update completed!"
```

```bash
sudo chmod +x /usr/local/bin/loyacrm-update.sh
```

### 2. Monitoring Script
```bash
sudo nano /usr/local/bin/loyacrm-status.sh
```

Contents:
```bash
#!/bin/bash
echo "=== PM2 Status ==="
pm2 status

echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager

echo "=== PostgreSQL Status ==="
sudo systemctl status postgresql --no-pager

echo "=== Disk Usage ==="
df -h /var/www/loyacrm
```

```bash
sudo chmod +x /usr/local/bin/loyacrm-status.sh
```

## 📊 Deployment Verification

### 1. Service Status Check
```bash
# PM2 status
pm2 status

# Nginx status
sudo systemctl status nginx

# PostgreSQL status
sudo systemctl status postgresql

# Port check
sudo netstat -tlnp | grep -E ':3000|:4000|:5432|:80'
```

### 2. Logs Check
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Availability Testing
```bash
# Backend API check
curl http://localhost:4000/api/health

# Frontend check
curl http://localhost:3000
```

## 🔄 Automatic Backup Setup

### 1. Create Backup Script
```bash
sudo nano /usr/local/bin/loyacrm-backup.sh
```

Contents:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/loyacrm"
DATE=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U loyacrm loyacrm > "$BACKUP_DIR/db_backup_$DATE.sql"

# Code backup (excluding node_modules)
tar --exclude='node_modules' --exclude='.git' -czf "$BACKUP_DIR/code_backup_$DATE.tar.gz" /var/www/loyacrm

# Remove old backups (older than 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/loyacrm-backup.sh
```

### 2. Setup Automatic Backup
```bash
# Add to crontab for daily backup
sudo crontab -e
```

Add line:
```
0 2 * * * /usr/local/bin/loyacrm-backup.sh
```

## 📝 Final Verification Commands

```bash
# Check all services
loyacrm-status.sh

# Check availability
echo "Open in browser: http://your-server-ip"
echo "API available at: http://your-server-ip/api"
```

## 🔧 Useful Management Commands

### PM2 Service Management
```bash
# Restart all services
pm2 restart all

# Stop services
pm2 stop all

# Start services
pm2 start all

# View logs
pm2 logs loyacrm-backend
pm2 logs loyacrm-frontend

# Real-time monitoring
pm2 monit
```

### System Management
```bash
# Update application
loyacrm-update.sh

# Check status
loyacrm-status.sh

# Backup
loyacrm-backup.sh

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Problem Diagnosis
```bash
# Check system logs
sudo journalctl -u nginx
sudo journalctl -u postgresql

# Check resource usage
htop
df -h
free -h

# Check network connections
sudo netstat -tlnp
sudo ss -tlnp
```

## 🚨 Troubleshooting

### Database Issues
```bash
# Check PostgreSQL connection
sudo -u postgres psql -c "\l"

# Check users
sudo -u postgres psql -c "\du"

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Node.js Application Issues
```bash
# Detailed PM2 logs
pm2 logs --lines 50

# Restart specific application
pm2 restart loyacrm-backend
pm2 restart loyacrm-frontend

# Full PM2 reload
pm2 kill
pm2 start ecosystem.config.js
```

### Nginx Issues
```bash
# Check configuration
sudo nginx -t

# Reload configuration
sudo nginx -s reload

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## 📋 Deployment Checklist

- [ ] Ubuntu system updated
- [ ] PostgreSQL installed and configured
- [ ] Database and user created
- [ ] Node.js 18+ installed
- [ ] PM2 installed
- [ ] Nginx installed and configured
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] npm dependencies installed
- [ ] Database migrations executed
- [ ] Production builds created
- [ ] PM2 ecosystem configured
- [ ] PM2 services started
- [ ] Nginx proxy configured
- [ ] SSL configured (optional)
- [ ] Firewall configured
- [ ] Management scripts created
- [ ] Backup configured
- [ ] Functionality verified
- [ ] Availability tested

## 📞 Support

If you encounter issues:
1. Check logs: `pm2 logs`
2. Check service status: `loyacrm-status.sh`
3. Check Nginx configuration: `sudo nginx -t`
4. Contact developer: sergeydaub@gmail.com

---

**Author:** Sergey Daub (sergeydaub@gmail.com)
**Version:** 1.0
**Date:** August 27, 2025
