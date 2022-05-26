const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const errorMessages = require('../errors/errorMessages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email обязательно должен быть указан'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: errorMessages.BadEmail,
    },
  },
  password: {
    type: String,
    required: [true, 'пароль обязательно должен быть указан'],
    select: false,
    minlength: [8, 'пароль не может быть короче четырех символов'],
  },
  name: {
    type: String,
    minlength: [2, 'имя пользователя не может быть короче двух символов'],
    maxlength: [30, 'имя пользователя не может быть длиннее 30 символов'],
    required: [true, 'имя обязательно должно быть указанно'],
  },
});

userSchema.static.findUserByCredentials = function getUserIfAuth(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errorMessages.BadEmailOrPassword));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(errorMessages.BadEmailOrPassword));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
