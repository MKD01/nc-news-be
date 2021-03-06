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

exports.checkAuthorExists = (userName) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [userName])
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
};

exports.checkCommentExists = (commentId) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [commentId])
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
};

exports.checkUserExists = (userName) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [userName])
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
};

exports.checkValidString = (string) => {
  if (string) {
    const check = string.split('').map((character) => {
      if (!/[a-zA-Z]/.test(character)) {
        return false;
      } else {
        return true;
      }
    });

    return check.every((elem) => elem === true);
  } else {
    return true;
  }
};

exports.checkValidNumber = (number) => {
  const check = number.split('').map((character) => {
    if (!/^\d+$/.test(character)) {
      return false;
    } else {
      return true;
    }
  });

  return check.every((elem) => elem === true);
};
