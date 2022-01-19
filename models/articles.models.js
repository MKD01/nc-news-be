const db = require('../db/connection');

exports.selectArticleByArticleId = (articleId) => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
