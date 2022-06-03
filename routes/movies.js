const router = require('express').Router();
const { getMovies, createMovies, deleteMovies } = require('../controllers/movies');
const { deleteMovieValidator, addMovieValidator } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', addMovieValidator, createMovies);
router.delete('/:id', deleteMovieValidator, deleteMovies);

module.exports = router;
