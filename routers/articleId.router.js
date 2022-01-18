const express = require('express');

const articleId = express.Router();

articleRouter.get('/');
articleRouter.patch('/');

articleRouter.get('/comments');
articleRouter.post('/comments');

module.exports = articleId;
