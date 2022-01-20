const {
  selectArticleByArticleId,
  updateArticlebyArticleId,
  selctArticles,
  selectCommentsByArticleId,
  createCommentArticleId,
} = require('../models/articles.models');
const {
  checkArticleExists,
  checkTopicExists,
  checkAuthorExists,
} = require('../utils/utils');

exports.getArticleByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;

  return checkArticleExists(articleId)
    .then((articleExists) => {
      if (articleExists) {
        return selectArticleByArticleId(articleId).then((article) => {
          return res.status(200).send({ article });
        });
      } else {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const articleBody = req.body.inc_votes;
  return checkArticleExists(articleId)
    .then((articleExists) => {
      if (articleExists) {
        return updateArticlebyArticleId(articleBody, articleId).then(
          (article) => {
            return res.status(201).send({ article });
          }
        );
      } else {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const sortBy = req.query.sort_by;
  const order_by = req.query.order_by;
  const topic = req.query.topic;
  checkTopicExists(topic)
    .then((topicExists) => {
      if (topicExists) {
        return selctArticles(sortBy, order_by, topic).then((articles) => {
          return res.status(200).send({ articles });
        });
      } else {
        return Promise.reject({ status: 400, msg: 'Bad request' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  return checkArticleExists(articleId)
    .then((articleExists) => {
      if (articleExists) {
        return selectCommentsByArticleId(articleId).then((comments) => {
          if (comments.length) {
            return res.status(200).send({ comments });
          } else {
            return Promise.reject({ status: 404, msg: 'Not found' });
          }
        });
      } else {
        return Promise.reject({ status: 400, msg: 'Bad request' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const userName = req.body.username;
  const body = req.body.body;
  const articleId = req.params.article_id;

  return checkArticleExists(articleId)
    .then((articleExists) => {
      if (articleExists) {
        return checkAuthorExists(userName).then((userExists) => {
          if (userExists) {
            return createCommentArticleId(userName, body, articleId).then(
              (comment) => {
                return res.status(201).send({ comment });
              }
            );
          } else {
            return Promise.reject({ status: 400, msg: 'Bad request' });
          }
        });
      } else {
        return Promise.reject({ status: 400, msg: 'Bad request' });
      }
    })
    .catch((err) => {
      next(err);
    });
};
