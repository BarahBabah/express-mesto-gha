const router = require('express').Router();
const { STATUS_CODES } = require('../utils/constants');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUsers } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/validate');

router.post('/signin', validateCreateUser, login);
router.post('/signup', validateLogin, createUsers);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({
    message: 'Страница не найдена',
  });
});

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
