const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const errorMessages = require('../errors/errorMessages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, errorMessages.EmailIsRequired],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: errorMessages.BadEmail,
    },
  },
  password: {
    type: String,
    required: [true, errorMessages.PasswordIsRequired],
    select: false,
    minlength: [8, errorMessages.PasswordMinLength],
  },
  name: {
    type: String,
    minlength: [2, errorMessages.NameMinLength],
    maxlength: [30, errorMessages.NameMaxLength],
    required: [true, errorMessages.NameMIsRequired],
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
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
