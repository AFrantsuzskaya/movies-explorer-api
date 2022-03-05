const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');

const routerUsers = require('./users');
const routerMovies = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middleware/auth');
const NotFoundError = ('../errors/404-not-found-error');
const routes = express.Router();

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

routes.use('/users', auth, routerUsers);
routes.use('/movies',auth, routerMovies);
routes.post('/signout',auth, logout);
routes.use('*', auth, () => {
  throw new NotFoundError('Маршрут не найден');
});

module.exports = routes;
