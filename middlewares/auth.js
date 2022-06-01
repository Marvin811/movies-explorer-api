require('dotenv').config();

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const errorMessages = require('../errors/errorMessages');
const config = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerHeader = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError(errorMessages.AuthorizationError));
  }

  const token = extractBearerHeader(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : config.JWT_SECRET_DEV);
  } catch (e) {
    next(new UnauthorizedError(errorMessages.AuthorizationError));
  }

  req.user = payload;

  return next();
};
