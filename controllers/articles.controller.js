const {
  selectArticleByArticleId,
  updateArticlebyArticleId,
  selctArticles,
  selectCommentsByArticleId,
  createCommentArticleId,
  createArticle,
  removeArticleByArticleId,
} = require("../models/articles.models");
const { selectTopicByName } = require("../models/topics.models");
const { selectUsersByUsername } = require("../models/users.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order_by, topic, limit, p } = req.query;

  const promises = [selctArticles(sort_by, order_by, topic, limit, p)];
  if (topic) {
    promises.push(selectTopicByName(topic));
  }

  Promise.all(promises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleByArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    selectArticleByArticleId(article_id),
    updateArticlebyArticleId(inc_votes, article_id),
  ])
    .then(([_, article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  Promise.all([
    selectArticleByArticleId(article_id),
    selectCommentsByArticleId(article_id, limit, p),
  ])
    .then(([_, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const articleId = req.params.article_id;

  createCommentArticleId(username, body, articleId)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { author, body, title, topic, article_img_url } = req.body;

  Promise.all([
    selectUsersByUsername(author),
    createArticle(author, body, title, topic, article_img_url),
  ])
    .then(([_, { article_id }]) => {
      return selectArticleByArticleId(article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleByArticleId(article_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
