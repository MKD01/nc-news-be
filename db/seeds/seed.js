const format = require('pg-format');
const db = require('../connection');

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE topics (
          slug VARCHAR(255) PRIMARY KEY,
          description TEXT NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(255) PRIMARY KEY,
          avatar_url TEXT NOT NULL,
          name VARCHAR(255) NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          topic VARCHAR(255) REFERENCES topics(slug),
          author VARCHAR(255) REFERENCES users(username),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR(255) REFERENCES users(username),
          article_id INT REFERENCES articles(article_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          body TEXT NOT NULL
        );`);
    })
    .then(() => {
      console.log('ok');
    });
};

module.exports = seed;
