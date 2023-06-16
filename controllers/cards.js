const cardModel = require('../models/card');
const { STATUS_CODES } = require('../utils/constants');

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  cardModel.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => {
      res.status(STATUS_CODES.CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => res.status(STATUS_CODES.OK).send({ message: `Карточка удалена: ${card._id}` }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Некорректный id карточки' });
        return;
      }
      if (err.message === 'NotFound') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(STATUS_CODES.CREATED).send(card.likes);
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
      } else if (err.message === ('NotFound')) {
        res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Пользователь не найден',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).orFail(new Error('NotFound'))
  .then((card) => {
    res.status(STATUS_CODES.OK).send(card.likes);
  }).catch((err) => {
    console.log(err.name);
    if (err.name === 'CastError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
    } else if (err.message === ('NotFound')) {
      res.status(STATUS_CODES.NOT_FOUND).send({
        message: 'Пользователь не найден',
        err: err.message,
        stack: err.stack,
      });
    } else {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
