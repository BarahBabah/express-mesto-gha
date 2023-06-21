/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { STATUS_CODES } = require('../utils/constants');
const { BadRequestError, ConflictUserError, NotFoundError } = require('../utils/errors');

const getUserById = (req, res, next) => {
  let action;

  if (req.path === '/me') {
    action = req.user._id;
  } else {
    action = req.params.user_id;
  }
  userModel.findById(action)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => {
      res.status(STATUS_CODES.OK).send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Некорректный id' ${action}`));
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  userModel.find({}).then((users) => {
    res.send(users);
  })
    .catch(next);
};

const createUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) throw new BadRequestError('Ошибка');
  bcrypt.hash(password, 10).then((hash) => {
    userModel.create({
      name, about, email, avatar, password: hash,
    })
      .then(() => {
        res.status(STATUS_CODES.CREATED).send({
          name, about, email, avatar,
        });
      })
      .catch((err) => {
        if (err.name === 'MongoServerError') {
          return next(new ConflictUserError('Пользователь с таким email уже существует'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Некорректные данные при создании пользователя'));
        }
        next(err);
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

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  userModel.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new NotFoundError('Пользователь не найден');
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') next(new BadRequestError('Переданы некорректные данные'));
      else next(err);
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  userModel.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new NotFoundError('Переданы некорректные данные');
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
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
