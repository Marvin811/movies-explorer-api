const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { userValidation, loginValidation } = require('../middlewares/validation');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');

const NotFoundError = require('../errors/NotFoundError');
const errorMessages = require('../errors/errorMessages');
const auth = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);
router.use(auth);

router.use('/users', usersRoutes);
router.use('/movies', moviesRoutes);

router.use((req, res, next) => next(new NotFoundError(errorMessages.NotFoundPage)));

module.exports = router;
