const express = require('express');
const {
  handle404s,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require('./errors/errors');
const apiRouter = require('./routers/api.router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
