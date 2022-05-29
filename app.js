const express = require('express');
const mongoose = require('mongoose');
const { handleError } = require('./errors/handleError');
const router = require('./routes/index');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(router);

app.use((err, req, res, next) => handleError({ res, err, next }));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
