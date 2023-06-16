const router = require('express').Router();
const { STATUS_CODES } = require('../utils/constants');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({
    message: 'Страница не найдена',
  });
});
module.exports = router;
