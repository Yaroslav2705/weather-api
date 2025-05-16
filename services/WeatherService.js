const axios = require('axios');

class WeatherService {
  async getWeather(city) {
    if (!city) {
      const err = new Error('City is required');
      err.status = 400;
      throw err;
    }

    const resp = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: city,
      },
    });
    const { temp_c: temperature, humidity, condition } = resp.data.current;

    return {
      temperature,
      humidity,
      description: condition.text,
    };
  }
}

module.exports = new WeatherService();

