const apiRouter = require("express").Router();
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const topicsRouter = require("./topics.router");

const { apiController } = require("../controllers/index")

apiRouter.get("/", apiController.conGetAPI)

apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter, commentsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);



module.exports = apiRouter;