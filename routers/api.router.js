const express = require('express');
const articleRouter = require('./article.router');
const userRouter = require('./user.router');
const commentRouter = require('./comment.router');
const { getTopics } = require('../controllers/topics.controllers');
const { getArticles } = require('../controllers/articles.controller');
const { getUsers } = require('../controllers/users.controllers');

const apiRouter = express.Router();

apiRouter.get('/topics', getTopics);

apiRouter.get('/articles', getArticles);
apiRouter.post('articles');
apiRouter.use('/articles', articleRouter);

apiRouter.get('/users', getUsers);
apiRouter.use('/users', userRouter);

apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;
