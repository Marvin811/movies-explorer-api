const router = require('express').Router();
const { getMovies, createMovies, deleteMovies } = require('../controllers/movies');
const { movieIdValidation, movieValidation } = require('../middlewares/validation');

router.get('/', movieIdValidation, getMovies);
router.post('/', movieValidation, createMovies);
router.delete('/:id', deleteMovies);

module.exports = router;
