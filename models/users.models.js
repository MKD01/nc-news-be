const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUsersByUsername = (userName) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [userName])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

      return rows[0];
    });
};

exports.createUser = async (username, name, avatar_url) => {
  const { rows } = await db.query(
    `INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *;`,
    [username, name, avatar_url]
  );

  return rows[0];
};
