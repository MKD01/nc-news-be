const db = require('../db/connection');

exports.removeCommentByCommentId = (commentId) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
};

exports.updateCommentbyCommentId = (articleBody, commentId) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [articleBody, commentId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
