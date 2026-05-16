# Развертывание на Hostinger

## Обзор

Этот проект использует многоязычность (i18n) Next.js, которая требует Node.js на сервере.

**Рекомендуемый вариант:** Node.js хостинг (VPS или Cloud Hosting)

Hostinger предлагает несколько типов хостинга:

1. **Node.js приложение** (VPS или Cloud Hosting) - **Рекомендуется** ✅
2. **Статический экспорт** (для обычного веб-хостинга) - требует изменения структуры проекта

---

## Вариант 1: Node.js на VPS (Рекомендуется)

Этот вариант сохраняет все функции проекта, включая многоязычность.

**Требования:**
- Hostinger VPS или Cloud Hosting (от $3.99/мес)
- SSH доступ
- Node.js 18+

### Шаг 1: Подготовка VPS

Подключитесь к вашему VPS по SSH:

```bash
ssh root@your-server-ip
# Или используйте SSH терминал в hPanel
```

Установите необходимое ПО:

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Node.js 18 (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте установку
node -v  # должно показать v18.x.x
npm -v

# Установите PM2 для управления процессом
sudo npm install -g pm2

# Установите Nginx (для проксирования)
sudo apt install nginx -y
```

### Шаг 2: Загрузка проекта на сервер

#### Вариант A: Через Git (рекомендуется)

```bash
# Создайте директорию для проекта
mkdir -p /var/www/znn
cd /var/www/znn

# Клонируйте репозиторий (если проект в Git)
git clone your-repository-url .
```

#### Вариант B: Через FTP/SFTP

1. Используйте FileZilla или WinSCP
2. Подключитесь через SFTP:
   - Host: ваш IP сервера
   - Port: 22
   - Protocol: SFTP
   - Username: root (или ваш пользователь)
   - Password: ваш пароль
3. Загрузите все файлы проекта в `/var/www/znn`

#### Вариант C: Через ZIP архив

```bash
# На локальном компьютере
# Создайте архив проекта (без node_modules и .next)

# На сервере
cd /var/www
# Загрузите архив через FTP или wget
wget your-archive-url/znn.zip
unzip znn.zip
mv znn-folder znn
cd znn
```

### Шаг 3: Установка зависимостей и сборка

```bash
cd /var/www/znn

# Установите зависимости
npm install

# Соберите проект
npm run build

# Проверьте, что сборка прошла успешно
# Должна появиться папка .next
```

### Шаг 4: Запуск приложения с PM2

```bash
# Запустите приложение через PM2
pm2 start npm --name "znn" -- start

# Проверьте статус
pm2 status

# Посмотрите логи (если нужно)
pm2 logs znn

# Добавьте в автозагрузку (чтобы приложение запускалось при перезагрузке)
pm2 startup
# Выполните команду, которую покажет PM2
pm2 save
```

Приложение теперь работает на `http://localhost:3000`

### Шаг 5: Настройка Nginx как обратного прокси

Создайте конфигурацию Nginx:

```bash
sudo nano /etc/nginx/sites-available/znn
```

Вставьте следующую конфигурацию:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Логи
    access_log /var/log/nginx/znn-access.log;
    error_log /var/log/nginx/znn-error.log;

    # Проксирование к Next.js
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

    # Кэширование статических файлов Next.js
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    # Кэширование изображений
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Важно:** Замените `yourdomain.com` на ваш реальный домен!

Активируйте конфигурацию:

```bash
# Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/znn /etc/nginx/sites-enabled/

# Проверьте конфигурацию на ошибки
sudo nginx -t

# Если всё ОК, перезапустите Nginx
sudo systemctl restart nginx

# Добавьте Nginx в автозагрузку
sudo systemctl enable nginx
```

Теперь сайт должен быть доступен по адресу `http://yourdomain.com`

### Шаг 6: Настройка SSL (HTTPS)

Используем бесплатный SSL сертификат от Let's Encrypt:

```bash
# Установите Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получите и установите SSL сертификат
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Следуйте инструкциям Certbot:
# - Введите email для уведомлений
# - Согласитесь с условиями
# - Выберите опцию перенаправления HTTP на HTTPS (рекомендуется)
```

Certbot автоматически:
- Получит SSL сертификат
- Обновит конфигурацию Nginx
- Настроит автоматическое обновление сертификата

Проверьте автообновление:

```bash
sudo certbot renew --dry-run
```

### Шаг 7: Финальная проверка

1. Откройте `https://yourdomain.com` в браузере
2. Проверьте обе языковые версии:
   - `https://yourdomain.com/en`
   - `https://yourdomain.com/ru`
3. Проверьте все разделы: articles, roasts, analytics, about, contact
4. Проверьте переключение языков в header
5. Проверьте мобильную версию

### Управление приложением

```bash
# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs znn

# Перезапуск приложения
pm2 restart znn

# Остановка
pm2 stop znn

# Запуск
pm2 start znn

# Удаление из PM2
pm2 delete znn
```

---

## Обновление сайта

Когда вы вносите изменения в код или контент:

### Через Git

```bash
# Подключитесь по SSH
ssh root@your-server-ip
cd /var/www/znn

# Получите последние изменения
git pull

# Установите новые зависимости (если есть)
npm install

# Пересоберите проект
npm run build

# Перезапустите приложение
pm2 restart znn

# Проверьте логи
pm2 logs znn --lines 50
```

### Через FTP

1. Внесите изменения локально
2. Соберите проект: `npm run build`
3. Загрузите измененные файлы через SFTP
4. Перезапустите приложение: `pm2 restart znn`

---

## Вариант 2: Статический экспорт (Требует изменений)

⚠️ **Внимание:** Для статического экспорта нужно изменить структуру роутинга проекта, так как Next.js i18n несовместим с `output: 'export'`.

### Что нужно изменить

1. **Создать папки языков в pages:**
   ```
   src/pages/
   ├── en/
   │   ├── index.tsx
   │   ├── articles/
   │   ├── roasts/
   │   └── ...
   └── ru/
       ├── index.tsx
       ├── articles/
       └── ...
   ```

2. **Удалить i18n из next.config.js:**
   ```js
   const nextConfig = {
     reactStrictMode: true,
     // i18n удален
     images: { unoptimized: true },
     output: 'export',
   }
   ```

3. **Реализовать кастомное переключение языков**

Этот подход требует значительной переработки структуры проекта и не рекомендуется, если у вас есть доступ к Node.js хостингу.

---

## Мониторинг и оптимизация

### Мониторинг

```bash
# Мониторинг процессов
pm2 monit

# Логи в реальном времени
pm2 logs znn --lines 100

# Использование ресурсов
htop
```

### Оптимизация производительности

1. **Настройка кэширования в Nginx** (уже настроено выше)

2. **Увеличение памяти для Node.js** (если нужно):
   ```bash
   pm2 delete znn
   pm2 start npm --name "znn" --node-args="--max-old-space-size=2048" -- start
   pm2 save
   ```

3. **Сжатие ответов:**
   В файл `/etc/nginx/nginx.conf` добавьте в секцию `http`:
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
   ```
   Затем: `sudo systemctl reload nginx`

---

## Настройка Firewall

```bash
# Разрешите HTTP и HTTPS
sudo ufw allow 'Nginx Full'

# Разрешите SSH
sudo ufw allow OpenSSH

# Включите firewall
sudo ufw enable

# Проверьте статус
sudo ufw status
```

---

## Устранение неполадок

### Проблема: Сайт не открывается

**Решение:**
```bash
# Проверьте статус приложения
pm2 status

# Проверьте статус Nginx
sudo systemctl status nginx

# Проверьте логи
pm2 logs znn
sudo tail -f /var/log/nginx/znn-error.log
```

### Проблема: Ошибка "Cannot find module"

**Решение:**
```bash
cd /var/www/znn
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart znn
```

### Проблема: Приложение "вылетает"

**Решение:**
```bash
# Увеличьте память Node.js
pm2 delete znn
pm2 start npm --name "znn" --node-args="--max-old-space-size=4096" -- start
pm2 save
```

### Проблема: SSL сертификат не обновляется

**Решение:**
```bash
# Проверьте статус Certbot
sudo systemctl status certbot.timer

# Вручную обновите сертификат
sudo certbot renew

# Перезапустите Nginx
sudo systemctl reload nginx
```

---

## Рекомендации перед развертыванием

✅ Обновите базовые URL в:
- `src/pages/sitemap.xml.tsx` (строка с baseUrl)
- `src/pages/robots.txt.tsx` (строка с baseUrl)

✅ Замените placeholder изображения в `/public`

✅ Обновите `og-image.jpg` для социальных сетей (1200x630px)

✅ Проверьте контактную информацию в Footer и Contact

✅ Настройте резервное копирование базы данных (если используете)

---

## Безопасность

### Обновление системы

```bash
# Регулярно обновляйте систему
sudo apt update && sudo apt upgrade -y

# Обновляйте Node.js зависимости
cd /var/www/znn
npm audit
npm audit fix
```

### Ограничение доступа

```bash
# Создайте отдельного пользователя для приложения
sudo adduser znnuser

# Измените владельца директории
sudo chown -R znnuser:znnuser /var/www/znn

# Запустите PM2 под этим пользователем
su - znnuser
cd /var/www/znn
pm2 start npm --name "znn" -- start
```

---

## Поддержка

По вопросам:
- Telegram: [@nnzaitsev](https://t.me/nnzaitsev)
- Telegram Channel: [@arhiroduct](https://t.me/arhiroduct)

---

**Успешного развертывания! 🚀**
