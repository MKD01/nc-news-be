const format = require("pg-format");
const db = require("../connection");
const { getRandomDate } = require("../../utils/utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
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
      return Promise.all([createTopics(), createUsers()]);
    })
    .then(() => {
      return createArticles();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      return Promise.all([addTopics(topicData), addUsers(userData)]);
    })
    .then(() => {
      return addArticles(articleData);
    })
    .then(() => {
      return addComments(commentData);
    });
};

const createTopics = () => {
  return db.query(`
    CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR
    );`);
};

const createUsers = () => {
  return db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR
    );`);
};

const createArticles = () => {
  return db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR REFERENCES topics(slug) ON DELETE CASCADE,
      author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
      body VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      votes INT DEFAULT 0 NOT NULL,
      article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
    );`);
};

const createComments = () => {
  return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      body VARCHAR NOT NULL,
      article_id INT REFERENCES articles(article_id)ON DELETE CASCADE,
      author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
      votes INT DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );`);
};

const addTopics = (topicData) => {
  const insertTopicsQueryStr = format(
    "INSERT INTO topics (slug, description) VALUES %L;",
    topicData.map(({ slug, description }) => [slug, description])
  );
  return db.query(insertTopicsQueryStr);
};

const addUsers = (userData) => {
  const insertUsersQueryStr = format(
    "INSERT INTO users ( username, name, avatar_url) VALUES %L;",
    userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ])
  );
  return db.query(insertUsersQueryStr);
};

const addArticles = (articleData) => {
  const formattedArticleData = articleData.map((article) => ({
    ...article,
    created_at: getRandomDate(),
  }));

  const insertArticlesQueryStr = format(
    "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;",
    formattedArticleData.map(
      ({
        title,
        topic,
        author,
        body,
        created_at,
        votes = 0,
        article_img_url,
      }) => [title, topic, author, body, created_at, votes, article_img_url]
    )
  );

  return db.query(insertArticlesQueryStr);
};

const addComments = (commentData) => {
  const formattedCommentData = commentData.map((comment) => ({
    ...comment,
    created_at: getRandomDate(),
  }));

  const insertCommentsQueryStr = format(
    "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;",
    formattedCommentData.map(
      ({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at,
      ]
    )
  );
  return db.query(insertCommentsQueryStr);
};

module.exports = seed;
