const express = require("express");
const {
  getArticleByArticleId,
  patchArticleByArticleId,
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteArticleByArticleId,
} = require("../controllers/articles.controller");
const articleRouter = express.Router();

articleRouter.get("/:article_id", getArticleByArticleId);
articleRouter.patch("/:article_id", patchArticleByArticleId);
articleRouter.delete("/:article_id", deleteArticleByArticleId);

articleRouter.get("/:article_id/comments", getCommentsByArticleId);
articleRouter.post("/:article_id/comments", postCommentByArticleId);

module.exports = articleRouter;
