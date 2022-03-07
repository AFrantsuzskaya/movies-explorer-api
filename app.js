require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/error-handler');

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use('*', cors({
  origin: 'https://movies.students.nomoredomains.xyz',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
