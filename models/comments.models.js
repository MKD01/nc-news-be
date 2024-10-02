const db = require("../db/connection");

exports.removeCommentByCommentId = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      commentId,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.updateCommentByCommentId = (inc_votes, comment_id) => {
  if (isNaN(+inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectCommentByCommentId = (comment_id) => {
  return db
    .query(`Select * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
