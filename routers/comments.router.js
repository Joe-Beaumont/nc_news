const commentsRouter = require("express").Router();

const { commentController } = require("../controllers/index")

commentsRouter
.route("/:comment_id")
.delete(commentController.conDeleteComments)
.patch(commentController.conPatchComments)


commentsRouter
.route("/:article_id/comments")
.get(commentController.conGetComments)
.post(commentController.conPostComment)

module.exports = commentsRouter;