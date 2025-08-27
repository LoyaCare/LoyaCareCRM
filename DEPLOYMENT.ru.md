# 🚀 Руководство по развертыванию LoyaCareCRM на Ubuntu Server

*Полная инструкция по развертыванию CRM системы на чистом Ubuntu сервере*

*🇷🇺 Русский | [🇺🇸 English](DEPLOYMENT.md) | [🇩🇪 Deutsch](DEPLOYMENT.de.md)*

## 📋 Предварительная подготовка

### 1. Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Установка необходимых пакетов
```bash
sudo apt install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

## 🗄️ Установка и настройка PostgreSQL

### 1. Установка PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```

### 2. Настройка PostgreSQL
```bash
# Запуск и автозапуск
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создание пользователя и базы данных
sudo -u postgres psql
```

В PostgreSQL консоли выполните:
```sql
CREATE USER loyacrm WITH PASSWORD 'your_strong_password';
CREATE DATABASE loyacrm OWNER loyacrm;
GRANT ALL PRIVILEGES ON DATABASE loyacrm TO loyacrm;
\q
```

### 3. Настройка доступа к PostgreSQL
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```
Найдите и раскомментируйте/измените:
```
listen_addresses = 'localhost'
```

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```
Добавьте строку:
```
local   loyacrm         loyacrm                                 md5
```

```bash
sudo systemctl restart postgresql
```

## 🟢 Установка Node.js и npm

### 1. Установка Node.js 18+ через NodeSource
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Проверка установки
```bash
node --version
npm --version
```

### 3. Установка PM2 для управления процессами
```bash
sudo npm install -g pm2
```

## 🌐 Установка и настройка Nginx

### 1. Установка Nginx
```bash
sudo apt install -y nginx
```

### 2. Запуск и автозапуск
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📁 Развертывание приложения

### 1. Клонирование репозитория
```bash
cd /var/www/
sudo git clone <your-repository-url> loyacrm
sudo chown -R $USER:$USER /var/www/loyacrm
cd loyacrm
```

### 2. Настройка переменных окружения

#### База данных:
```bash
cd db
nano .env
```
Содержимое `.env`:
```env
DATABASE_URL="postgresql://loyacrm:your_strong_password@localhost:5432/loyacrm"
```

#### Backend:
```bash
cd ../backend
nano .env
```
Содержимое `.env`:
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
Содержимое `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-server-ip:4000
```

### 3. Установка зависимостей и инициализация БД

#### База данных:
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

## 🚀 Запуск сервисов с PM2

### 1. Создание конфигурации PM2
```bash
cd /var/www/loyacrm
nano ecosystem.config.js
```

Содержимое `ecosystem.config.js`:
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

### 2. Запуск приложений
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
⚠️ **Важно:** Выполните команду, которую выдаст `pm2 startup`.

## 🌐 Настройка Nginx как обратный прокси

### 1. Создание конфигурации сайта
```bash
sudo nano /etc/nginx/sites-available/loyacrm
```

Содержимое конфигурации:
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

    # Статические файлы Next.js
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 2. Активация сайта
```bash
sudo ln -s /etc/nginx/sites-available/loyacrm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Настройка SSL (опционально, но рекомендуется)

### 1. Установка Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Получение SSL сертификата
```bash
sudo certbot --nginx -d your-domain.com
```

## 🛡️ Настройка файрвола

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 🔧 Создание скриптов управления

### 1. Скрипт для обновления приложения
```bash
sudo nano /usr/local/bin/loyacrm-update.sh
```

Содержимое:
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

### 2. Скрипт для мониторинга
```bash
sudo nano /usr/local/bin/loyacrm-status.sh
```

Содержимое:
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

## 📊 Проверка развертывания

### 1. Проверка сервисов
```bash
# Статус PM2
pm2 status

# Статус Nginx
sudo systemctl status nginx

# Статус PostgreSQL
sudo systemctl status postgresql

# Проверка портов
sudo netstat -tlnp | grep -E ':3000|:4000|:5432|:80'
```

### 2. Проверка логов
```bash
# Логи PM2
pm2 logs

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Тестирование доступности
```bash
# Проверка backend API
curl http://localhost:4000/api/health

# Проверка frontend
curl http://localhost:3000
```

## 🔄 Настройка автоматического резервного копирования

### 1. Создание скрипта резервного копирования
```bash
sudo nano /usr/local/bin/loyacrm-backup.sh
```

Содержимое:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/loyacrm"
DATE=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

# Резервная копия базы данных
pg_dump -h localhost -U loyacrm loyacrm > "$BACKUP_DIR/db_backup_$DATE.sql"

# Резервная копия кода (без node_modules)
tar --exclude='node_modules' --exclude='.git' -czf "$BACKUP_DIR/code_backup_$DATE.tar.gz" /var/www/loyacrm

# Удаление старых резервных копий (старше 7 дней)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/loyacrm-backup.sh
```

### 2. Настройка автоматического резервного копирования
```bash
# Добавление в crontab для ежедневного резервного копирования
sudo crontab -e
```

Добавьте строку:
```
0 2 * * * /usr/local/bin/loyacrm-backup.sh
```

## 📝 Финальные команды для проверки

```bash
# Проверка всех сервисов
loyacrm-status.sh

# Проверка доступности
echo "Откройте в браузере: http://your-server-ip"
echo "API доступно по адресу: http://your-server-ip/api"
```

## 🔧 Полезные команды для управления

### Управление сервисами PM2
```bash
# Перезапуск всех сервисов
pm2 restart all

# Остановка сервисов
pm2 stop all

# Запуск сервисов
pm2 start all

# Просмотр логов
pm2 logs loyacrm-backend
pm2 logs loyacrm-frontend

# Мониторинг в реальном времени
pm2 monit
```

### Управление системой
```bash
# Обновление приложения
loyacrm-update.sh

# Проверка статуса
loyacrm-status.sh

# Резервное копирование
loyacrm-backup.sh

# Перезапуск Nginx
sudo systemctl restart nginx

# Перезапуск PostgreSQL
sudo systemctl restart postgresql
```

### Диагностика проблем
```bash
# Проверка логов системы
sudo journalctl -u nginx
sudo journalctl -u postgresql

# Проверка использования ресурсов
htop
df -h
free -h

# Проверка сетевых подключений
sudo netstat -tlnp
sudo ss -tlnp
```

## 🚨 Устранение неисправностей

### Проблемы с базой данных
```bash
# Проверка подключения к PostgreSQL
sudo -u postgres psql -c "\l"

# Проверка пользователей
sudo -u postgres psql -c "\du"

# Перезапуск PostgreSQL
sudo systemctl restart postgresql
```

### Проблемы с Node.js приложениями
```bash
# Детальные логи PM2
pm2 logs --lines 50

# Перезапуск конкретного приложения
pm2 restart loyacrm-backend
pm2 restart loyacrm-frontend

# Полная перезагрузка PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Проблемы с Nginx
```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка конфигурации
sudo nginx -s reload

# Проверка логов ошибок
sudo tail -f /var/log/nginx/error.log
```

## 📋 Контрольный список развертывания

- [ ] Обновлена система Ubuntu
- [ ] Установлен и настроен PostgreSQL
- [ ] Создана база данных и пользователь
- [ ] Установлен Node.js 18+
- [ ] Установлен PM2
- [ ] Установлен и настроен Nginx
- [ ] Склонирован репозиторий
- [ ] Настроены переменные окружения
- [ ] Установлены зависимости npm
- [ ] Выполнены миграции базы данных
- [ ] Собраны production сборки
- [ ] Настроен PM2 ecosystem
- [ ] Запущены сервисы PM2
- [ ] Настроен Nginx прокси
- [ ] Настроен SSL (опционально)
- [ ] Настроен файрвол
- [ ] Созданы скрипты управления
- [ ] Настроено резервное копирование
- [ ] Проверена работоспособность
- [ ] Протестирована доступность

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `pm2 logs`
2. Проверьте статус сервисов: `loyacrm-status.sh`
3. Проверьте конфигурацию Nginx: `sudo nginx -t`
4. Обратитесь к разработчику: sergeydaub@gmail.com

---

**Автор:** Sergey Daub (sergeydaub@gmail.com)
**Версия:** 1.0
**Дата:** 27 августа 2025
