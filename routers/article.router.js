const express = require('express');
const {
  getArticleByArticleId,
  patchArticleByArticleId,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('../controllers/articles.controller');
const articleRouter = express.Router();

articleRouter.get('/:article_id', getArticleByArticleId);
articleRouter.patch('/:article_id', patchArticleByArticleId);

articleRouter.get('/:article_id/comments', getCommentsByArticleId);
articleRouter.post('/:article_id/comments', postCommentByArticleId);

module.exports = articleRouter;
