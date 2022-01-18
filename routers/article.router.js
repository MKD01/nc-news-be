const express = require('express');
const articleIdRouter = require('./articleId.router');

const articleRouter = express.Router();

articleRouter.get('/');

articleRouter.use('/:article_id', articleIdRouter);

module.exports = articleRouter;
