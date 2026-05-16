# Быстрый старт развертывания на Hostinger

## Требования

- Hostinger VPS или Cloud Hosting (от $3.99/мес)
- SSH доступ к серверу
- Ваш домен привязан к IP сервера

## Шаги за 15 минут ⚡

### 1. Подключитесь по SSH

```bash
ssh root@your-server-ip
```

Или используйте SSH терминал в hPanel Hostinger.

### 2. Установите Node.js и PM2

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установите PM2
sudo npm install -g pm2

# Установите Nginx
sudo apt install nginx -y
```

### 3. Загрузите проект

**Вариант A - Через Git:**
```bash
mkdir -p /var/www/znn && cd /var/www/znn
git clone your-repo-url .
```

**Вариант B - Через FTP:**
- Используйте FileZilla/WinSCP
- Подключитесь по SFTP (порт 22)
- Загрузите все файлы в `/var/www/znn`

### 4. Соберите и запустите

```bash
cd /var/www/znn
npm install
npm run build
pm2 start npm --name "znn" -- start
pm2 startup
pm2 save
```

### 5. Настройте Nginx

Создайте конфигурацию:

```bash
sudo nano /etc/nginx/sites-available/znn
```

Вставьте (замените `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте:

```bash
sudo ln -s /etc/nginx/sites-available/znn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Настройте SSL

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Следуйте инструкциям Certbot (выберите редирект на HTTPS).

### 7. Проверьте сайт

Откройте в браузере:
- `https://yourdomain.com/en` - английская версия
- `https://yourdomain.com/ru` - русская версия

## ✅ Готово!

Ваш сайт онлайн и работает на Node.js.

---

## Быстрые команды

```bash
# Статус приложения
pm2 status

# Логи
pm2 logs znn

# Перезапуск
pm2 restart znn

# Обновление сайта (если используете Git)
cd /var/www/znn
git pull
npm install
npm run build
pm2 restart znn
```

---

## Проблемы?

Полная документация с решением проблем: [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)

---

## Не хотите возиться с сервером?

Альтернативные варианты:
- **Vercel** - развертывание одной командой `vercel`
- **Netlify** - автоматический деплой из Git
- **Railway** - простой Node.js хостинг

Но Hostinger VPS дает больше контроля и дешевле в долгосрочной перспективе.

---

**Успешного развертывания! 🚀**
