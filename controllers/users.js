const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { STATUS_CODES } = require('../utils/constants');

const getUserById = (req, res) => {
  let action;

  if (req.path === '/me') {
    action = req.user._id;
  } else {
    action = req.params.id;
  }
  userModel.findById(action)
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      res.status(STATUS_CODES.OK).send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: `Некорректный id' ${action}` });
        return;
      }
      if (err.message === 'NotFoundId') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const getUsers = (req, res) => {
  userModel.find({}).then((users) => {
    res.send(users);
  })
    .catch(() => {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const createUsers = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    userModel.create({
      name, about, email, avatar, password: hash,
    })
      .then((user) => {
        res.status(STATUS_CODES.CREATED).send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(STATUS_CODES.BAD_REQUEST)
            .send({ message: 'Некорректные данные при создании пользователя' });
        } else {
          res.status(STATUS_CODES.SERVER_ERROR)
            .send({
              message: 'На сервере произошла ошибка',
            });
        }
      });
  });
};

const login = (req, res, next) => {
  const { password, email } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    }).catch(next);
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
  login,
};
