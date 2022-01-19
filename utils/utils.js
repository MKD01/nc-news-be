const db = require('../db/connection');

exports.checkArticleExists = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
};

exports.checkTopicExists = (topicCheck) => {
  return db.query(`SELECT topic FROM articles`).then((result) => {
    if (!topicCheck) {
      return true;
    } else {
      return result.rows.some((topicValue) => {
        if (topicValue.topic === topicCheck) {
          return true;
        } else {
          return false;
        }
      });
    }
  });
};
