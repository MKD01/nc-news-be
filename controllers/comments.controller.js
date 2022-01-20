const { removeCommentByCommentId } = require('../models/comments.models');
const { checkCommentExists } = require('../utils/utils');

exports.deleteCommentByCommentId = (req, res, next) => {
  const commentId = req.params.comment_id;
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
};
