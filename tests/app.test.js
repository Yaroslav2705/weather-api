// tests/app.test.js
const request = require('supertest');
const app = require('../app'); // ваш Express-app

describe('API Endpoints', () => {
  it('GET /api/weather должно вернуть JSON', async () => {
    const res = await request(app).get('/api/weather?city=Kyiv');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('temperature');
  });
});

