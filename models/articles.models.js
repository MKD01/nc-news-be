const db = require('../db/connection');

exports.selectArticleByArticleId = (articleId) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles 
      INNER JOIN comments 
      ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticlebyArticleId = (articleBody, articleId) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [articleBody, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selctArticles = (sortBy = 'created_at', orderBy = 'DESC', topic) => {
  let topicCondition = false;
  if (!topic) {
    topicCondition = true;
  }

  const allowedSortBy = [
    'article_id',
    'title',
    'body',
    'votes',
    'author',
    'topic',
    'created_at',
    'comment_count',
  ];

  if (!allowedSortBy.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  const allowedOrder = ['ASC', 'DESC', 'asc', 'desc'];
  if (!allowedOrder.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles 
    INNER JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE ${topicCondition} OR topic = $1 
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${orderBy};`,
      [topic]
    )
    .then(({ rows }) => {
      return rows;
    });
};
