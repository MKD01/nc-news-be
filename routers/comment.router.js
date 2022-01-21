const express = require('express');
const {
  deleteCommentByCommentId,
  patchCommentByCommentId,
} = require('../controllers/comments.controllers');

const commentRouter = express.Router();

commentRouter.delete('/:comment_id', deleteCommentByCommentId);
commentRouter.patch('/:comment_id', patchCommentByCommentId);

module.exports = commentRouter;
