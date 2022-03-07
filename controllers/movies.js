const Movie = require('../models/movie');
const BadRequestError = require('../errors/400-bad-request-error');
const NotFoundError = require('../errors/400-bad-request-error');
const ForbiddenError = require('../errors/403-forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.postMovies = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovies = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Передан несуществующий _id')); // TODOO
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError('Не достаточно прав на удаление фильма')); // TODOO
      }
      return movie.remove()
        .then(() => res.send('Фильм удалён'))
        .catch(next);
    })
    .catch(next);
};
