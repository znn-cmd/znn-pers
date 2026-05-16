# Изменения для развертывания на Hostinger

## Важное замечание

Этот проект использует **Next.js i18n** для многоязычности (EN/RU), что требует **Node.js** на сервере.

**Рекомендуемое решение:** Hostinger VPS или Cloud Hosting с Node.js

## Что было подготовлено

### 1. Конфигурация `next.config.js`

Проект настроен для Node.js deployment:
- `output: 'standalone'` - для оптимизированной Node.js сборки
- `i18n` конфигурация сохранена для многоязычности
- `images: { unoptimized: true }` - для совместимости

### 2. Создана документация

**Файлы:**
- `HOSTINGER_DEPLOYMENT.md` - полная инструкция по развертыванию на VPS
- `HOSTINGER_QUICKSTART.md` - быстрый старт за 15 минут
- `.htaccess` - для будущего статического экспорта (если понадобится)

### 3. Обновлен `README.md`

Добавлена секция с информацией о развертывании на Hostinger.

## Способы развертывания

### Вариант 1: Node.js на VPS (Рекомендуется) ✅

**Преимущества:**
- ✅ Сохраняет все функции (i18n, динамические маршруты)
- ✅ Не требует изменений в коде
- ✅ Лучше для SEO (серверный рендеринг)
- ✅ Быстрее работает

**Требования:**
- Hostinger VPS ($3.99/мес и выше)
- Node.js 18+
- PM2 для управления процессом
- Nginx как обратный прокси

**Процесс:**
1. Подключиться по SSH
2. Установить Node.js, PM2, Nginx
3. Загрузить проект
4. Собрать и запустить: `npm install && npm run build && pm2 start npm --name znn -- start`
5. Настроить Nginx
6. Настроить SSL

### Вариант 2: Статический экспорт (Не рекомендуется)

⚠️ **Требует переработки структуры проекта**

Для статического экспорта нужно:
1. Удалить i18n из next.config.js
2. Создать отдельные папки /en и /ru в pages/
3. Переписать логику переключения языков
4. Изменить структуру маршрутов

Это займет несколько часов работы и не рекомендуется.

## Структура развертывания на VPS

```
Пользователь
    ↓ HTTPS (443)
Nginx (Обратный прокси)
    ↓ HTTP (3000)
Next.js (PM2)
    ↓
Файловая система
```

## Быстрый старт

```bash
# 1. Подключитесь по SSH
ssh root@your-server-ip

# 2. Установите ПО
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2

# 3. Загрузите проект
mkdir -p /var/www/znn && cd /var/www/znn
# Загрузите файлы через Git или FTP

# 4. Соберите и запустите
npm install
npm run build
pm2 start npm --name "znn" -- start
pm2 startup && pm2 save

# 5. Настройте Nginx (см. HOSTINGER_DEPLOYMENT.md)

# 6. Настройте SSL
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## Обновление сайта

```bash
cd /var/www/znn
git pull  # или загрузите новые файлы через FTP
npm install
npm run build
pm2 restart znn
```

## Мониторинг

```bash
pm2 status          # статус
pm2 logs znn        # логи
pm2 restart znn     # перезапуск
pm2 monit          # мониторинг ресурсов
```

## Стоимость

**Hostinger VPS:**
- VPS 1: $3.99/мес (1 vCore, 4GB RAM) - достаточно для этого проекта
- VPS 2: $5.99/мес (2 vCore, 8GB RAM) - с запасом

**Альтернативы:**
- Vercel: бесплатно для личных проектов
- Netlify: бесплатно с ограничениями
- Railway: $5/мес

## Преимущества Hostinger VPS

✅ Полный контроль над сервером  
✅ Можно разместить несколько проектов  
✅ SSH доступ  
✅ Можно настроить базу данных  
✅ Дешевле в долгосрочной перспективе  
✅ Фиксированная стоимость (не зависит от трафика)  

## Важно перед развертыванием

✅ Привяжите домен к IP сервера в DNS  
✅ Обновите домен в `src/pages/sitemap.xml.tsx`  
✅ Обновите домен в `src/pages/robots.txt.tsx`  
✅ Замените placeholder изображения  
✅ Проверьте контактную информацию  

## Поддержка

- Telegram: [@nnzaitsev](https://t.me/nnzaitsev)
- Полная документация: `HOSTINGER_DEPLOYMENT.md`

---

**Проект готов к развертыванию на Hostinger VPS! 🚀**
