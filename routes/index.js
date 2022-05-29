const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const movieRoutes = require('./movies');
const userRoutes = require('./users');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use((req, res, next) => next(new NotFoundError('Маршрут не найден')));

module.exports = router;
