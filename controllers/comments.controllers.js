const {
  removeCommentByCommentId,
  updateCommentByCommentId,
} = require("../models/comments.models");

exports.deleteCommentByCommentId = (req, res, next) => {
  const commentId = req.params.comment_id;

  removeCommentByCommentId(commentId)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateCommentByCommentId(inc_votes, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
