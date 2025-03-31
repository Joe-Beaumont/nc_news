const articlesRouter = require("express").Router();
const commentsRouter = require("./comments.router");
const { articleController } = require("../controllers/index")

articlesRouter
.route("/")
.get(articleController.conGetArticles)

articlesRouter
.route("/:article_id")
.get(articleController.conGetArticleByID)
.patch(articleController.conPatchArticles)


articlesRouter.use('/:article_id/comments', commentsRouter);

module.exports = articlesRouter;