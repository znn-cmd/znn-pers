# Развертывание на Hostinger - Краткое резюме

## Главное

Ваш проект **требует Node.js** для работы многоязычности (EN/RU).

**Решение:** Используйте **Hostinger VPS** или **Cloud Hosting** (от $3.99/мес)

## Что нужно сделать

### 1️⃣ Купите Hostinger VPS

Перейдите на [hostinger.com](https://hostinger.com) → VPS Hosting

Рекомендуемый тариф: **VPS 1** ($3.99/мес)
- 1 vCore CPU
- 4GB RAM  
- 50GB SSD
- 1TB трафик

Этого достаточно для вашего проекта с запасом.

### 2️⃣ Настройте домен

В панели управления Hostinger привяжите ваш домен к IP адресу VPS.

### 3️⃣ Разверните проект

**Быстрая инструкция:** [HOSTINGER_QUICKSTART.md](HOSTINGER_QUICKSTART.md) (15 минут)

**Подробная инструкция:** [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md) (с объяснениями)

### Команды в двух словах:

```bash
# Подключитесь к серверу
ssh root@ваш-ip

# Установите Node.js и PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2

# Загрузите проект (через Git или FTP)
mkdir -p /var/www/znn && cd /var/www/znn
# Загрузите файлы

# Соберите и запустите
npm install && npm run build
pm2 start npm --name "znn" -- start
pm2 startup && pm2 save

# Настройте Nginx (см. инструкцию)
# Настройте SSL (см. инструкцию)
```

## Почему нельзя на обычный хостинг?

Проект использует Next.js с встроенной многоязычностью (i18n), которая работает **только с Node.js**.

Для обычного веб-хостинга (без Node.js) нужно было бы:
- Переписать структуру роутинга
- Создать папки /en и /ru вручную
- Изменить логику переключения языков
- Убрать i18n из конфигурации

Это займет несколько часов. Проще использовать VPS.

## Альтернативы Hostinger

Если не хотите возиться с VPS, есть простые альтернативы:

### Vercel (Рекомендуется для простоты)
```bash
npm i -g vercel
vercel
```
Бесплатно для личных проектов. Деплой за 2 минуты.

### Railway
- Автоматический деплой из Git
- $5/мес
- Очень простой интерфейс

### Netlify
- Бесплатно с ограничениями
- Автоматический деплой

## Что выбрать?

| Вариант | Стоимость | Сложность | Контроль |
|---------|-----------|-----------|----------|
| **Vercel** | Бесплатно | ⭐ Очень просто | Средний |
| **Hostinger VPS** | $3.99/мес | ⭐⭐⭐ Средне | Полный |
| **Railway** | $5/мес | ⭐⭐ Просто | Средний |
| **Netlify** | Бесплатно | ⭐⭐ Просто | Средний |

**Рекомендация:**
- Если нужно быстро и просто → **Vercel**
- Если нужен полный контроль и планируете больше проектов → **Hostinger VPS**
- Если хочется золотую середину → **Railway**

## Файлы для изучения

1. **[HOSTINGER_QUICKSTART.md](HOSTINGER_QUICKSTART.md)** - быстрый старт за 15 минут
2. **[HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)** - подробная инструкция со всеми деталями
3. **[HOSTINGER_CHANGES.md](HOSTINGER_CHANGES.md)** - что было подготовлено в проекте

## Нужна помощь?

- Telegram: [@nnzaitsev](https://t.me/nnzaitsev)
- Telegram Channel: [@arhiroduct](https://t.me/arhiroduct)

---

## TL;DR

1. Проект работает только на **Node.js** (из-за многоязычности)
2. Нужен **Hostinger VPS** ($3.99/мес) или другой Node.js хостинг
3. Инструкции готовы, следуйте [HOSTINGER_QUICKSTART.md](HOSTINGER_QUICKSTART.md)
4. Или используйте **Vercel** для быстрого деплоя (`vercel`)

**Готово! 🚀**


