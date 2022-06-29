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

const options = {
  origin: [
    'http://localhost:3000',
    'https://api.movies.mav1.nomoredomains.xyz',
    'http://api.movies.mav1.nomoredomains.xyz',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('*', cors(options));
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => handleError({ res, err, next }));

app.listen(PORT);
