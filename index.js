// index.js
require('dotenv').config();

const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const cron       = require('node-cron');

const { getWeather } = require('./controllers/WeatherController');
const {
  subscribe,
  confirm,
  unsubscribe
} = require('./controllers/SubscriptionController');

const WeatherService = require('./services/WeatherService');
const prisma         = require('./prisma/client');
const Mailer         = require('./utils/mailer');

const app = express();

// 1) Раздача статики из папки public (index.html будет по /)
app.use(express.static(path.join(__dirname, 'public')));

// 2) Парсинг JSON
app.use(bodyParser.json());

const SubscriptionService = require('./services/SubscriptionService');

//подтверждение подписки
app.get('/confirm/:token', async (req, res) => {
  try {
    await SubscriptionService.confirm(req.params.token);
    // Отправляем статичную HTML-страницу из public/
    res.sendFile(path.join(__dirname, 'public', 'confirm.html'));
  } catch (err) {
    res.status(err.status || 500).send(`
      <h1>Ошибка</h1>
      <p>${err.message}</p>
    `);
  }
});


// Маршрут для подтверждения отписки
app.get('/unsubscribe/:token', async (req, res) => {
  try {
    await SubscriptionService.unsubscribe(req.params.token);
    // Отдаём статичную страницу public/unsubscribe.html
    res.sendFile(path.join(__dirname, 'public', 'unsubscribe.html'));
  } catch (err) {
    res
      .status(err.status || 500)
      .send(`<h1>Ошибка отписки</h1><p>${err.message}</p>`);
  }
});


// --- API Endpoints ---
app.get('/api/weather',       getWeather);
app.post('/api/subscribe',    subscribe);
app.get('/api/confirm/:token',   confirm);
app.get('/api/unsubscribe/:token', unsubscribe);

// --- Test Email Endpoint ---
app.get('/api/test-email', async (req, res, next) => {
  try {
    const to = req.query.to;
    if (!to) return res.status(400).json({ error: 'Query parameter "to" is required' });
    await Mailer.send(
      to,
      'Test Email from Weather API',
      'Если вы видите это письмо — SMTP настроен правильно.'
    );
    res.json({ message: `Test email sent to ${to}` });
  } catch (err) {
    next(err);
  }
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// --- Cron Jobs ---

// Hourly at minute 0
cron.schedule('0 * * * *', async () => {
  console.log('🔄 Running hourly cron job');
  try {
    const subs = await prisma.subscription.findMany({
      where: { frequency: 'hourly', confirmed: true },
      include: { city: true },
    });
    for (const s of subs) {
      try {
        const weather = await WeatherService.getWeather(s.city.name);
        await Mailer.send(
          s.email,
          `Hourly weather for ${s.city.name}`,
          `Temp: ${weather.temperature}°C, Humidity: ${weather.humidity}%`
        );
      } catch (err) {
        console.error(`Error sending hourly to ${s.email}:`, err);
      }
    }
  } catch (err) {
    console.error('Hourly cron failed:', err);
  }
}, {
  timezone: 'Europe/Bratislava'
});

// Daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('🔄 Running daily cron job');
  try {
    const subs = await prisma.subscription.findMany({
      where: { frequency: 'daily', confirmed: true },
      include: { city: true },
    });
    for (const s of subs) {
      try {
        const weather = await WeatherService.getWeather(s.city.name);
        await Mailer.send(
          s.email,
          `Daily weather for ${s.city.name}`,
          `Temp: ${weather.temperature}°C, Humidity: ${weather.humidity}%`
        );
      } catch (err) {
        console.error(`Error sending daily to ${s.email}:`, err);
      }
    }
  } catch (err) {
    console.error('Daily cron failed:', err);
  }
}, {
  timezone: 'Europe/Bratislava'
});

