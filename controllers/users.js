const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const ValidationError = require('../errors/ValidationError');
const errorMessages = require('../errors/errorMessages');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.createUser = (req, res, next) => {
  const {
    email,
    name,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then(() => res.send({ message: `Пользователь ${email} успешно создан` }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(errorMessages.DuplicateEmail));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError(errorMessages.BadRequestUser));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.send({ email: user.email, name: user.name });
      }
      throw new NotFoundError(errorMessages.NotFoundUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(errorMessages.BadRequestUser));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.DuplicateEmail));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!email || !password) {
        next(new UnauthorizedError(errorMessages.UnauthorizedError));
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError(errorMessages.UnauthorizedError));
    });
};
