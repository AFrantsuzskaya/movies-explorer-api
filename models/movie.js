const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  duration: {
    type: Number,
    required: true,
    min: 2,
    max: 500,
  },
  year: {
    type: String,
    required: true,
    min: 4,
    max: 10,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(img) {
        return validator.isURL(img);
      },
      message: 'Недопустимая ссылка',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Недопустимая ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Недопустимая ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId, // ????
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
