// tests/services.test.js

const axios = require('axios');
const WeatherService = require('../services/WeatherService');
const SubscriptionService = require('../services/SubscriptionService');

// Моки
jest.mock('axios');

jest.mock('../prisma/client', () => ({
  subscription: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
  city: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../utils/mailer', () => ({ send: jest.fn() }));

// После моков импортируем клиент и mailer
const prisma = require('../prisma/client');
const Mailer = require('../utils/mailer');

// Тесты для WeatherService
describe('WeatherService', () => {
  it('should throw 400 if city is not provided', async () => {
    await expect(WeatherService.getWeather()).rejects.toMatchObject({ status: 400 });
  });

  it('should return weather data formatted correctly', async () => {
    axios.get.mockResolvedValue({
      data: { current: { temp_c: 22, humidity: 55, condition: { text: 'Cloudy' } } }
    });
    const result = await WeatherService.getWeather('Kyiv');
    expect(result).toEqual({ temperature: 22, humidity: 55, description: 'Cloudy' });
  });
});

// Тесты для SubscriptionService
describe('SubscriptionService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should throw 409 if email already subscribed', async () => {
    prisma.subscription.findFirst.mockResolvedValue({ email: 'test@example.com', city: { name: 'Kyiv' } });
    await expect(
      SubscriptionService.subscribe({ email: 'test@example.com', city: 'Kyiv', frequency: 'hourly' })
    ).rejects.toMatchObject({ status: 409 });
  });

  it('should create subscription and send confirmation email', async () => {
    prisma.subscription.findFirst.mockResolvedValue(null);
    prisma.city.findUnique.mockResolvedValue({ id: 1, name: 'Kyiv' });
    prisma.subscription.create.mockResolvedValue({ token: 'abc' });

    await SubscriptionService.subscribe({ email: 'user@test.com', city: 'Kyiv', frequency: 'daily' });

    expect(prisma.city.findUnique).toHaveBeenCalledWith({ where: { name: 'Kyiv' } });
    expect(prisma.subscription.create).toHaveBeenCalled();
    expect(Mailer.send).toHaveBeenCalledWith(
      'user@test.com',
      expect.stringContaining('Підтвердіть'),
      expect.any(String),
      expect.any(String)
    );
  });
});

