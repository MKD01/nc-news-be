const { selectTopics } = require('../models/topics.models');

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      if (topics.length) {
        res.status(200).send({ topics });
      } else {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};
