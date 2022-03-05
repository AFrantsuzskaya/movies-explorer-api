const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, patchUser } = require('../controllers/users');

routerUsers.get('/me', getUser);
routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

module.exports = routerUsers;
