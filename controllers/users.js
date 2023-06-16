const userModel = require('../models/user');

const getUserById = (req, res) => {
  userModel.findById(req.params.user_id).then((user) => {
    res.status(200).send(user);
  }).catch((err) => {
    res.status(500).send({
      message: 'На сервере произошла ошибка',
      err: err.message,
      stack: err.stack,
    });
  });
};

const getUsers = (req, res) => {
  userModel.find({}).then((users) => {
    res.send(users);
  })
    .catch((err) => {
      res.status(500).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUsers = (req, res) => {
  userModel.create(req.body).then((user) => {
    res.status(201).send(user);
  })
    .catch((err) => {
      res.status(500).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
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
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Validation Error',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
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
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(
          {
            message: 'Validation Error',
            err: err.message,
            stack: err.stack,
          },
        );
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getUserById,
  getUsers,
  createUsers,
  updateUser,
  updateAvatar,
};
