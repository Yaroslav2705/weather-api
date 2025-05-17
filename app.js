// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { getWeather } = require('./controllers/WeatherController');
const { subscribe, confirm, unsubscribe } = require('./controllers/SubscriptionController');

const app = express();
app.use(bodyParser.json());

// Swagger UI
const swaggerDoc = YAML.load(path.join(__dirname, 'api/openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// API routes
app.get('/api/weather', getWeather);
app.post('/api/subscribe', subscribe);
app.get('/api/confirm/:token', confirm);
app.get('/api/unsubscribe/:token', unsubscribe);

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;

