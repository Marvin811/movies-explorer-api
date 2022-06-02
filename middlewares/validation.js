const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validationUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Невалидный URL!');
};

module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().min(24).max(24),
  }),
});

module.exports.addMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().required(),
    year: Joi.number().min(1900).max(2025).required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(validationUrl).required(),
    trailerLink: Joi.string().pattern(validationUrl).required(),
    thumbnail: Joi.string().pattern(validationUrl).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
