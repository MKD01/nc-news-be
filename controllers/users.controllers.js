const {
  selectUsers,
  selectUsersByUsername,
  createUser,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;

  selectUsersByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = async (req, res, next) => {
  try {
    const { username, name, avatar_url } = req.body;
    const newUser = await createUser(username, name, avatar_url);

    res.status(201).send({ user: newUser });
  } catch (err) {
    next(err);
  }
};
