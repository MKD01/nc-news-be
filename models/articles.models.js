const db = require("../db/connection");

exports.selctArticles = (
  sortBy = "created_at",
  orderBy = "DESC",
  topic,
  limit = 10,
  page = 1
) => {
  const allowedSortBy = [
    "article_id",
    "title",
    "body",
    "votes",
    "author",
    "topic",
    "created_at",
    "comment_count",
  ];
  const allowedOrder = ["ASC", "DESC", "asc", "desc"];

  if (!allowedSortBy.includes(sortBy) || !allowedOrder.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let startPage = (page - 1) * limit;

  let queryStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id`;
  const queryArr = [];

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryArr.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY ${sortBy} ${orderBy}
  LIMIT ${limit}
  OFFSET ${startPage}`;

  return db.query(queryStr, queryArr).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleByArticleId = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.updateArticlebyArticleId = (inc_votes, article_id) => {
  if (isNaN(+inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (articleId, limit = 10, page = 1) => {
  const startPage = (page - 1) * limit;

  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT ${limit} OFFSET ${startPage}`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.createCommentArticleId = (username, body, articleId) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING comment_id, votes, created_at, author, body;`,
      [username, body, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.createArticle = (author, body, title, topic, article_img_url) => {
  let queryStr = `INSERT INTO articles (author, body, title, topic`;
  const queryArr = [author, body, title, topic];

  if (article_img_url !== undefined) {
    queryStr += `, article_img_url`;
    queryArr.push(article_img_url);
  }

  queryStr += `) VALUES ($1, $2, $3, $4 ${
    article_img_url !== undefined ? `, $5` : ""
  }) RETURNING *`;

  return db.query(queryStr, queryArr).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeArticleByArticleId = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
