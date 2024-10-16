const format = require("pg-format");
const db = require("../db/connection");

const getCountFromQuery = ({ rows }) => {
  const { count } = rows[0];
  return +count;
};

exports.selectNumOfArticles = (topic) => {
  let query = format("SELECT count(*) FROM %I", "articles");
  const queryArr = [];

  if (topic) {
    query += ` WHERE topic = $1`;
    queryArr.push(topic);
  }

  return db.query(query, queryArr).then(getCountFromQuery);
};

exports.selectNumOfCommentsByArticleId = (article_id) => {
  const query = format(
    "SELECT count(*) FROM %I WHERE article_id = $1",
    "comments"
  );

  return db.query(query, [article_id]).then(getCountFromQuery);
};
