const { Joi, celebrate } = require('celebrate');

const patternUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const validateCard = celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().pattern(patternUrl),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(patternUrl),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(patternUrl),
  }),
});
const validateLogin = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  validateAvatar,
  validateUserId,
  validateUserInfo,
  validateCreateUser,
  validateCardId,
  validateCard,
  validateLogin,
};
