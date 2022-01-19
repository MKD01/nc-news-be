const express = require('express');
const { getArticleByArticleId } = require('../controllers/articles.controller');

const articleId = express.Router();

articleId.get('/comments');
articleId.post('/comments');

module.exports = articleId;
