const db = require('../db/connection');

exports.selctArticles = (
  sortBy = 'created_at',
  orderBy = 'DESC',
  topic,
  limit = 10,
  page = 1
) => {
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
  const allowedOrder = ['ASC', 'DESC', 'asc', 'desc'];

  if (!allowedSortBy.includes(sortBy) || !allowedOrder.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  let startPage = (page - 1) * limit;

  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE ${topicCondition} OR topic = $1 
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${orderBy}
    LIMIT ${limit}
    OFFSET ${startPage};`,
      [topic]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleByArticleId = (articleId) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments 
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

exports.selectCommentsByArticleId = (articleId, limit = 10) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at LIMIT ${limit};`,
      [articleId]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.createCommentArticleId = (userName, body, articleId) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING comment_id, votes, created_at, author, body;`,
      [userName, body, articleId]
    )
    .then((result) => {
      return result.rows[0];
    });
};
