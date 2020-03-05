const jwt = require('jsonwebtoken');
const config = require('../config');
const VOTE_CLOSED = config.env.VOTE_CLOSED;

module.exports = function (onClose = null) {
  return function (req, res, next) {
    let token = req.header('Authorization') || '';
    token = token.replace('Bearer', '').trim();
    if (onClose !== null && onClose !== VOTE_CLOSED) {
      return res.status('401').send({ error: 'error_endpoint_closed' });
    }
    if (!token) {
      return res.status('401').send({ error: 'error_missing_token' });
    }
    try {
      const data = jwt.verify(token, config.env.JWT_SECRET);
      req.user = data;
      next();
    } catch (ex) {
      res.status('401').send({ error: 'error_invalid_token' });
    }
  }
}