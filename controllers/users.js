const userModel = require('../models/user');

const { STATUS_CODES } = require('../utils/constants');

const getUserById = (req, res) => {
  userModel.findById(req.params.user_id)
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      res.status(STATUS_CODES.OK).send(user);
    }).catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: `Некорректный id' ${req.params.user_id}` });
        return;
      }
      if (err.message === 'NotFoundId') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const getUsers = (req, res) => {
  userModel.find({}).then((users) => {
    res.send(users);
  })
    .catch((err) => {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUsers = (req, res) => {
  userModel.create(req.body).then((user) => {
    res.status(STATUS_CODES.CREATED).send(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Некорректные данные при создании пользователя' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  userModel.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({
          message: 'Validation Error',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  userModel.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send(
          {
            message: 'Validation Error',
            err: err.message,
            stack: err.stack,
          },
        );
      }
      return res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getUserById,
  getUsers,
  createUsers,
  updateUser,
  updateAvatar,
};
