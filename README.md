# Weather Forecast API

Демо: [https://weather-api-vgwj.onrender.com](https://weather-api-vgwj.onrender.com)

Простий сервіс для підписки на регулярні оновлення погоди у вибраному місті.

## Ключові можливості

* GET `/api/weather?city={город}` — отримати актуальну погоду
* POST `/api/subscribe` — оформити підписку (email, місто, `hourly|daily`)
* GET `/confirm/{token}` — підтвердити підписку
* GET `/unsubscribe/{token}` — відписатися
* Cron-завдання: розсилання щогодини та щодня
* Пошта: надсилання листів через SMTP (Mailtrap або реальний сервер)
* Зберігання: PostgreSQL + Prisma
* Фронтенд: статична форма та сторінки в `public`

## Стек технологій

* Node.js + Express
* Prisma ORM + PostgreSQL
* nodemailer для SMTP
* node-cron для завдань за розкладом
* Docker & Docker Compose
* Jest + Supertest для тестiв
* swagger-ui-express для документації

## Логіка реалізації

* Архітектура: розділена на частини Controller → Service → Prisma → База даних
* Контролери (`controllers/...`): обробляють HTTP-запити, валідують вхідні дані та викликають сервіси
* Сервіси (`services/...`): реалізують бізнес-логіку (створення підписки, підтвердження, надсилання листів)
* Prisma: ORM для роботи з PostgreSQL; міграції проганяються командою `npx prisma migrate deploy` при старті
* Mailer (`utils/mailer.js`): обгортка над nodemailer для надсилання листів з HTML-шаблонами та тестовими посиланнями
* Cron-завдання (`node-cron`): надсилання оновлень за розкладом (щогодини/щодня)
* Статичні файли: HTML-форми та сторінки лежать у папці `public`, підключаються через `express.static`

## Запуск проекта

1. Клонувати репозиторій:

   ```bash
   git clone https://github.com/Yaroslav2705/weather-api.git
   cd weather-api
   ```

2. Скопіювати `.env.example` → `.env`, заповнити змінні:

   ```env
   DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/weather
   WEATHER_API_KEY=<ключ_WeatherAPI>
   APP_URL=http://localhost:8080
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=<mailtrap_user>
   SMTP_PASS=<mailtrap_pass>
   SMTP_FROM=no-reply@weatherapi.app
   ```

3. Встановити залежності та запустити:

   ```bash
   npm install
   npm run start
   ```

   або в Docker:

   ```bash
   docker-compose up --build
   ```

## HTML-файли

* `public/index.html` — форма пiдписки
* `public/confirm.html` — сторiнка пiдтверждення
* `public/unsubscribe.html` — сторiнка вiдписки

## Документацiя

* OpenAPI spec: `GET /openapi.yaml`

## Тести

```bash
npm test
```

* Unit-тести для сервисiв
* Тести E2E для сценарію підписки/підтвердження/відписки

## Деплой на Render.com

1. Підключити репозиторій до Render.com
2. Створити Web Service з Dockerfile
3. Build Command: `npm install && npx prisma migrate deploy`
4. Start Command: `npm run start`
5. Додати PostgreSQL через Render Databases та задати `DATABASE_URL`
6. Вказати інші змінні (`WEATHER_API_KEY`, `APP_URL`, `SMTP_*`)
7. Deploy та отримати публічний URL

