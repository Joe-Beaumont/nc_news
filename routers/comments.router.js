const commentsRouter = require("express").Router();

const { commentController } = require("../controllers/index")

commentsRouter
.route("/:comment_id")
.get(commentController.conGetComments)
.delete(commentController.conDeleteComments)
.patch(commentController.conPatchComments)


commentsRouter
.route("/:article_id/comments")
.get(commentController.conGetCommentsbyArticle)
.post(commentController.conPostComment)

module.exports = commentsRouter;