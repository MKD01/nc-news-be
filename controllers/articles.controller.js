const { selectArticleByArticleId } = require('../models/articles.models');
const { checkArticleExists } = require('../utils/utils');

exports.getArticleByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;

  return checkArticleExists(articleId)
    .then((articleExists) => {
      if (articleExists) {
        return selectArticleByArticleId(articleId).then((result) => {
          return res.status(200).send({ result });
        });
      } else {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};
