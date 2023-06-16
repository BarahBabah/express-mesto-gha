const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({
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
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => res.status(500).send(
      {
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      },

    ));
};

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.status(201).send(card.likes);
  });
};

const dislikeCard = (req, res) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (!card) {
    return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
  }
  return res.status(200).send(card.likes);
}).catch((err) => res.status(500).send(
  {
    message: 'На сервере произошла ошибка',
    err: err.message,
    stack: err.stack,
  },

));

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
