require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { handleError } = require('./errors/handleError');
const router = require('./routes/index');
const limiter = require('./utils/limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const config = require('./utils/config');

// Слушаем 3000 порт
const { dbSrc, NODE_ENV } = process.env;
const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? dbSrc : config.mongodb, {
  useNewUrlParser: true,
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => handleError({ res, err, next }));

app.listen(PORT);
