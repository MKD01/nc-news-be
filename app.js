const express = require('express');
const cors = require('cors');
const {
  handle404s,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require('./errors/errors');
const apiRouter = require('./routers/api.router');
const { getApi } = require('./controllers/api.controllers');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api', getApi);
app.use('/api', apiRouter);

app.all('*', handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
