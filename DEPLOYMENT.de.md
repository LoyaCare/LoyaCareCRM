# 🚀 LoyaCareCRM Ubuntu Server Deployment-Leitfaden

*Vollständige Deployment-Anleitung für CRM-System auf sauberem Ubuntu-Server*

*[🇷🇺 Русский](DEPLOYMENT.ru.md) | [🇺🇸 English](DEPLOYMENT.md) | 🇩🇪 Deutsch*

## 📋 Voraussetzungen

### 1. System-Update
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Benötigte Pakete installieren
```bash
sudo apt install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

## 🗄️ PostgreSQL Installation und Konfiguration

### 1. PostgreSQL installieren
```bash
sudo apt install -y postgresql postgresql-contrib
```

### 2. PostgreSQL konfigurieren
```bash
# Starten und Autostart aktivieren
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Benutzer und Datenbank erstellen
sudo -u postgres psql
```

In der PostgreSQL-Konsole ausführen:
```sql
CREATE USER loyacrm WITH PASSWORD 'your_strong_password';
CREATE DATABASE loyacrm OWNER loyacrm;
GRANT ALL PRIVILEGES ON DATABASE loyacrm TO loyacrm;
\q
```

### 3. PostgreSQL-Zugriff konfigurieren
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```
Finden und auskommentieren/ändern:
```
listen_addresses = 'localhost'
```

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```
Zeile hinzufügen:
```
local   loyacrm         loyacrm                                 md5
```

```bash
sudo systemctl restart postgresql
```

## 🟢 Node.js und npm Installation

### 1. Node.js 18+ über NodeSource installieren
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Installation überprüfen
```bash
node --version
npm --version
```

### 3. PM2 für Prozessverwaltung installieren
```bash
sudo npm install -g pm2
```

## 🌐 Nginx Installation und Konfiguration

### 1. Nginx installieren
```bash
sudo apt install -y nginx
```

### 2. Starten und Autostart aktivieren
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📁 Anwendungs-Deployment

### 1. Repository klonen
```bash
cd /var/www/
sudo git clone <your-repository-url> loyacrm
sudo chown -R $USER:$USER /var/www/loyacrm
cd loyacrm
```

### 2. Umgebungsvariablen konfigurieren

#### Datenbank:
```bash
cd db
nano .env
```
Inhalt der `.env`:
```env
DATABASE_URL="postgresql://loyacrm:your_strong_password@localhost:5432/loyacrm"
```

#### Backend:
```bash
cd ../backend
nano .env
```
Inhalt der `.env`:
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
Inhalt der `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-server-ip:4000
```

### 3. Abhängigkeiten installieren und Datenbank initialisieren

#### Datenbank:
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

## 🚀 Services mit PM2 starten

### 1. PM2-Konfiguration erstellen
```bash
cd /var/www/loyacrm
nano ecosystem.config.js
```

Inhalt der `ecosystem.config.js`:
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

### 2. Anwendungen starten
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
⚠️ **Wichtig:** Führen Sie den Befehl aus, den `pm2 startup` ausgibt.

## 🌐 Nginx als Reverse Proxy konfigurieren

### 1. Site-Konfiguration erstellen
```bash
sudo nano /etc/nginx/sites-available/loyacrm
```

Konfigurationsinhalt:
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

    # Next.js statische Dateien
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 2. Site aktivieren
```bash
sudo ln -s /etc/nginx/sites-available/loyacrm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL-Konfiguration (Optional aber empfohlen)

### 1. Certbot installieren
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. SSL-Zertifikat erhalten
```bash
sudo certbot --nginx -d your-domain.com
```

## 🛡️ Firewall-Konfiguration

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 🔧 Verwaltungsskripte erstellen

### 1. Anwendungs-Update-Skript
```bash
sudo nano /usr/local/bin/loyacrm-update.sh
```

Inhalt:
```bash
#!/bin/bash
cd /var/www/loyacrm

echo "Repository wird aktualisiert..."
git pull origin main

echo "Datenbank wird aktualisiert..."
cd db
npm run generate

echo "Backend wird erstellt..."
cd ../backend
npm install --production
npm run build

echo "Frontend wird erstellt..."
cd ../frontend
npm install --production
npm run build

echo "Services werden neu gestartet..."
pm2 restart all

echo "Update abgeschlossen!"
```

```bash
sudo chmod +x /usr/local/bin/loyacrm-update.sh
```

### 2. Überwachungsskript
```bash
sudo nano /usr/local/bin/loyacrm-status.sh
```

Inhalt:
```bash
#!/bin/bash
echo "=== PM2 Status ==="
pm2 status

echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager

echo "=== PostgreSQL Status ==="
sudo systemctl status postgresql --no-pager

echo "=== Festplattennutzung ==="
df -h /var/www/loyacrm
```

```bash
sudo chmod +x /usr/local/bin/loyacrm-status.sh
```

## 📊 Deployment-Überprüfung

### 1. Service-Status prüfen
```bash
# PM2-Status
pm2 status

# Nginx-Status
sudo systemctl status nginx

# PostgreSQL-Status
sudo systemctl status postgresql

# Port-Überprüfung
sudo netstat -tlnp | grep -E ':3000|:4000|:5432|:80'
```

### 2. Logs überprüfen
```bash
# PM2-Logs
pm2 logs

# Nginx-Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Verfügbarkeit testen
```bash
# Backend-API prüfen
curl http://localhost:4000/api/health

# Frontend prüfen
curl http://localhost:3000
```

## 🔄 Automatisches Backup einrichten

### 1. Backup-Skript erstellen
```bash
sudo nano /usr/local/bin/loyacrm-backup.sh
```

Inhalt:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/loyacrm"
DATE=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

# Datenbank-Backup
pg_dump -h localhost -U loyacrm loyacrm > "$BACKUP_DIR/db_backup_$DATE.sql"

# Code-Backup (ohne node_modules)
tar --exclude='node_modules' --exclude='.git' -czf "$BACKUP_DIR/code_backup_$DATE.tar.gz" /var/www/loyacrm

# Alte Backups entfernen (älter als 7 Tage)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup abgeschlossen: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/loyacrm-backup.sh
```

### 2. Automatisches Backup einrichten
```bash
# Zu crontab für tägliches Backup hinzufügen
sudo crontab -e
```

Zeile hinzufügen:
```
0 2 * * * /usr/local/bin/loyacrm-backup.sh
```

## 📝 Abschließende Überprüfungsbefehle

```bash
# Alle Services überprüfen
loyacrm-status.sh

# Verfügbarkeit überprüfen
echo "Im Browser öffnen: http://your-server-ip"
echo "API verfügbar unter: http://your-server-ip/api"
```

## 🔧 Nützliche Verwaltungsbefehle

### PM2-Service-Verwaltung
```bash
# Alle Services neu starten
pm2 restart all

# Services stoppen
pm2 stop all

# Services starten
pm2 start all

# Logs anzeigen
pm2 logs loyacrm-backend
pm2 logs loyacrm-frontend

# Echtzeit-Überwachung
pm2 monit
```

### System-Verwaltung
```bash
# Anwendung aktualisieren
loyacrm-update.sh

# Status überprüfen
loyacrm-status.sh

# Backup
loyacrm-backup.sh

# Nginx neu starten
sudo systemctl restart nginx

# PostgreSQL neu starten
sudo systemctl restart postgresql
```

### Problemdiagnose
```bash
# System-Logs überprüfen
sudo journalctl -u nginx
sudo journalctl -u postgresql

# Ressourcennutzung überprüfen
htop
df -h
free -h

# Netzwerkverbindungen überprüfen
sudo netstat -tlnp
sudo ss -tlnp
```

## 🚨 Fehlerbehebung

### Datenbankprobleme
```bash
# PostgreSQL-Verbindung überprüfen
sudo -u postgres psql -c "\l"

# Benutzer überprüfen
sudo -u postgres psql -c "\du"

# PostgreSQL neu starten
sudo systemctl restart postgresql
```

### Node.js-Anwendungsprobleme
```bash
# Detaillierte PM2-Logs
pm2 logs --lines 50

# Spezifische Anwendung neu starten
pm2 restart loyacrm-backend
pm2 restart loyacrm-frontend

# Vollständigen PM2-Neustart
pm2 kill
pm2 start ecosystem.config.js
```

### Nginx-Probleme
```bash
# Konfiguration überprüfen
sudo nginx -t

# Konfiguration neu laden
sudo nginx -s reload

# Fehler-Logs überprüfen
sudo tail -f /var/log/nginx/error.log
```

## 📋 Deployment-Checkliste

- [ ] Ubuntu-System aktualisiert
- [ ] PostgreSQL installiert und konfiguriert
- [ ] Datenbank und Benutzer erstellt
- [ ] Node.js 18+ installiert
- [ ] PM2 installiert
- [ ] Nginx installiert und konfiguriert
- [ ] Repository geklont
- [ ] Umgebungsvariablen konfiguriert
- [ ] npm-Abhängigkeiten installiert
- [ ] Datenbank-Migrationen ausgeführt
- [ ] Produktions-Builds erstellt
- [ ] PM2-Ecosystem konfiguriert
- [ ] PM2-Services gestartet
- [ ] Nginx-Proxy konfiguriert
- [ ] SSL konfiguriert (optional)
- [ ] Firewall konfiguriert
- [ ] Verwaltungsskripte erstellt
- [ ] Backup konfiguriert
- [ ] Funktionalität überprüft
- [ ] Verfügbarkeit getestet

## 📞 Support

Bei Problemen:
1. Logs überprüfen: `pm2 logs`
2. Service-Status überprüfen: `loyacrm-status.sh`
3. Nginx-Konfiguration überprüfen: `sudo nginx -t`
4. Entwickler kontaktieren: sergeydaub@gmail.com

---

**Autor:** Sergey Daub (sergeydaub@gmail.com)
**Version:** 1.0
**Datum:** 27. August 2025
