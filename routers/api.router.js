const express = require('express');
const articleRouter = require('./article.router');
const userRouter = require('./user.router');
const commentRouter = require('./comment.router');
const { getTopics } = require('../controllers/topics.controllers');
const { getArticles } = require('../controllers/articles.controller');

const apiRouter = express.Router();

apiRouter.get('/');

apiRouter.get('/topics', getTopics);

apiRouter.get('/articles', getArticles);

apiRouter.use('/articles', articleRouter);

apiRouter.use('/users', userRouter);

apiRouter.route('/comments', commentRouter);

module.exports = apiRouter;
