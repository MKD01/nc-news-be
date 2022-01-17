const format = require('pg-format');
const db = require('../connection');
const {
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
} = require('../../utils/seed-formatting');

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
      const topicSql = format(
        `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`,
        formatTopics(topicData)
      );

      return db.query(topicSql);
    })
    .then(() => {
      const userSql = format(
        `INSERT INTO users(username, avatar_url, name) VALUES %L RETURNING *;`,
        formatUsers(userData)
      );

      return db.query(userSql);
    })
    .then(() => {
      const articleSql = format(
        `INSERT INTO articles(title, body, votes, topic, author, created_at) VALUES %L RETURNING *;`,
        formatArticles(articleData)
      );

      return db.query(articleSql);
    })
    .then(() => {
      const commentsSql = format(
        `INSERT INTO comments(author, article_id, votes, created_at, body) VALUES %L RETURNING *`,
        formatComments(commentData)
      );

      return db.query(commentsSql);
    });
};

module.exports = seed;
