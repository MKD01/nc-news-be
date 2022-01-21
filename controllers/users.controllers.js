const {
  selectUsers,
  selectUsersByUserName,
} = require('../models/users.models');
const { checkUserExists } = require('../utils/utils');

exports.getUsers = (req, res, next) => {
  return selectUsers().then((users) => {
    return res.status(200).send({ users });
  });
};

exports.getUsersByUserId = (req, res, next) => {
  const userName = req.params.username;
  return checkUserExists(userName)
    .then((userExists) => {
      if (userExists) {
        return selectUsersByUserName(userName).then((user) => {
          return res.status(200).send({ user });
        });
      } else {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};
