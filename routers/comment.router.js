const express = require('express');
const {
  deleteCommentByCommentId,
} = require('../controllers/comments.controller');

const commentRouter = express.Router();

commentRouter.delete('/:comment_id', deleteCommentByCommentId);

commentRouter.get('/:comment_id');

module.exports = commentRouter;
