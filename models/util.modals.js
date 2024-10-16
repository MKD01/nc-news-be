const format = require("pg-format");
const db = require("../db/connection");

const getCountFromQuery = ({ rows }) => {
  const { count } = rows[0];
  return +count;
};

exports.selectNumOfArticles = () => {
  const query = format("SELECT count(*) FROM %I", "articles");

  return db.query(query).then(getCountFromQuery);
};

exports.selectNumOfCommentsByArticleId = (article_id) => {
  const query = format(
    "SELECT count(*) FROM %I WHERE article_id = $1",
    "comments"
  );

  return db.query(query, [article_id]).then(getCountFromQuery);
};
