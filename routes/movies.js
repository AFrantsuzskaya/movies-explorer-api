const routerMovies = require('express').Router();
const { celebrate, Joi, Error } = require('celebrate');
const validator = require('validator');
const { getMovies, postMovies, deleteMovies } = require('../controllers/movies');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

routerMovies.get('/', getMovies);

routerMovies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailerLink: Joi.string().required().custom(validateURL),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.string().length(24).hex(),
  }),
}), postMovies);

routerMovies.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovies);

module.exports = routerMovies;
