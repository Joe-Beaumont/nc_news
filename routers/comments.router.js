const commentsRouter = require("express").Router();

const { commentController } = require("../controllers/index")

commentsRouter
.route("/:comment_id")
.delete(commentController.conDeleteComments)


commentsRouter
.route("/:article_id/comments")
.get(commentController.conGetComments)
.post(commentController.conPostComment)
.patch(commentController.conPatchComments)


module.exports = commentsRouter;