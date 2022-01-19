const express = require('express');
// const articleIdRouter = require('./articleId.router');
const { getArticleByArticleId } = require('../controllers/articles.controller');
const articleRouter = express.Router();

articleRouter.get('/');

articleRouter.get('/:article_id', getArticleByArticleId);

module.exports = articleRouter;
