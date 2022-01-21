const db = require('../db/connection');

exports.selectUsers = () => {
  return db.query(`SELECT username FROM users`).then((result) => {
    return result.rows;
  });
};

exports.selectUsersByUserName = (userName) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [userName])
    .then((result) => {
      return result.rows[0];
    });
};
