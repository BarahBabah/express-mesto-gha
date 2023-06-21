const router = require('express').Router();
const { errors } = require('celebrate');
const { STATUS_CODES } = require('../utils/constants');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUsers } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/validate');
const { NotFoundError } = require('../utils/errors');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUsers);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
router.use(errors());
router.use((err, req, res, next) => {
  const { statusCode = STATUS_CODES.SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

module.exports = router;
