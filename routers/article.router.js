const express = require('express');
// const articleIdRouter = require('./articleId.router');
const {
  getArticleByArticleId,
  patchArticleByArticleId,
} = require('../controllers/articles.controller');
const articleRouter = express.Router();

articleRouter.get('/:article_id', getArticleByArticleId);
articleRouter.patch('/:article_id', patchArticleByArticleId);

module.exports = articleRouter;
