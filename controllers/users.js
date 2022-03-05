const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const ConflictError = require('../errors/409-conflict-error');
const BadRequestError = require('../errors/400-bad-request-error');
const NotFoundError = require('../errors/404-not-found-error');

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 8)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        secure: true,
        httpOnly: true,
        // sameSite: true,
        SameSite: 'none',
      }).send({ message: 'успешная авторизация' })
        .end();
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').status(200).send({ message: 'Токен удален' });
};

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;
  User.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с id: ${userId} не найден`))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};
