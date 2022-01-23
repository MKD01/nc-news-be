const {
  removeCommentByCommentId,
  updateCommentbyCommentId,
} = require('../models/comments.models');
const { checkCommentExists, checkValidNumber } = require('../utils/utils');

exports.deleteCommentByCommentId = (req, res, next) => {
  const commentId = req.params.comment_id;
  if (checkValidNumber(commentId)) {
    return checkCommentExists(commentId)
      .then((commentExists) => {
        if (commentExists) {
          return removeCommentByCommentId(commentId).then(() => {
            res.status(204).send({});
          });
        } else {
          return Promise.reject({ status: 404, msg: 'Not found' });
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next({ status: 400, msg: 'Bad request' });
  }
};

exports.patchCommentByCommentId = (req, res, next) => {
  const commentId = req.params.comment_id;
  const articleBody = req.body.inc_votes;

  if (checkValidNumber(commentId)) {
    return checkCommentExists(commentId)
      .then((commentExists) => {
        if (commentExists) {
          return updateCommentbyCommentId(articleBody, commentId).then(
            (comment) => {
              return res.status(200).send({ comment });
            }
          );
        } else {
          return Promise.reject({ status: 404, msg: 'Not found' });
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next({ status: 400, msg: 'Bad request' });
  }
};
