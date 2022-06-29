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

app.use(cors({
  origin: [
    'localhost:3000',
    'http://localhost:3000',
    'https://api.movies.mav1.nomoredomains.xyz',
    'http://api.movies.mav1.nomoredomains.xyz',
  ],
  methods: 'GET, POST, PATCH, DELETE',
  allowedHeaders: 'Content-Type, Authorization, Origin, Accept',
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => handleError({ res, err, next }));

app.listen(PORT);
