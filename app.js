const express = require("express")
const app = express();
const { handle404, handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./controllers/error.controller");
const { apiController, articleController, commentController, topicController, userController } = require("./controllers/index")
const cors = require("cors");

app.use(cors());
app.use(express.json());

//routers

const apiRouter = require("./routers/api.router")
app.use("/api", apiRouter)


// app.get("/api", apiController.conGetAPI);

// app.get("/api/topics", topicController.conGetTopics);

// app.get("/api/articles", articleController.conGetArticles)

// app.get("/api/articles/:article_id", articleController.conGetArticleByID);

// app.patch("/api/articles/:article_id", articleController.conPatchArticles)

// app.get("/api/articles/:article_id/comments", commentController.conGetComments)

// app.post("/api/articles/:article_id/comments", commentController.conPostComment)

// app.delete("/api/comments/:comment_id", commentController.conDeleteComments)

// app.get("/api/users", userController.conGetUsers)


// Middleware


app.all('/*', handle404);

app.use(handlePostgresErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app