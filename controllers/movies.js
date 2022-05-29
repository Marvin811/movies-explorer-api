const Movie = require('../models/movie');

const ValidationError = require('../errors/ValidationError');
const errorMessages = require('../errors/errorMessages');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(errorMessages.BadRequestError));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovies = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(new NotFoundError(errorMessages.NotFoundError))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return movie
          .remove()
          .then(res.send({ message: errorMessages.SuccessDelete }));
      }
      throw new ForbiddenError(errorMessages.ForbiddenError);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(errorMessages.BadRequestUser));
      } else {
        next(err);
      }
    });
};
