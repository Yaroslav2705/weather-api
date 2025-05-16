const SubscriptionService = require('../services/SubscriptionService');

exports.subscribe = async (req, res, next) => {
  try {
    const result = await SubscriptionService.subscribe(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const result = await SubscriptionService.confirm(req.params.token);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const result = await SubscriptionService.unsubscribe(req.params.token);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

