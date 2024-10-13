const express = require("express");
const articleRouter = require("./article.router");
const userRouter = require("./user.router");
const commentRouter = require("./comment.router");
const { getTopics, postTopics } = require("../controllers/topics.controllers");
const {
  getArticles,
  postArticle,
} = require("../controllers/articles.controller");
const { getUsers, postUser } = require("../controllers/users.controllers");
const { getStatus } = require("../controllers/api.controllers");

const apiRouter = express.Router();

apiRouter.get("/status", getStatus);

apiRouter.get("/topics", getTopics);
apiRouter.post("/topics", postTopics);

apiRouter.get("/articles", getArticles);
apiRouter.post("/articles", postArticle);
apiRouter.use("/articles", articleRouter);

apiRouter.get("/users", getUsers);
apiRouter.post("/users", postUser);
apiRouter.use("/users", userRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
