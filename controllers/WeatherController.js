const WeatherService = require('../services/WeatherService');

exports.getWeather = async (req, res, next) => {
  try {
    const data = await WeatherService.getWeather(req.query.city);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

