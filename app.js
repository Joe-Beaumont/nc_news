const express = require("express")
const { conGetAPI } = require("./controllers/api.controller")
const { conGetTopics } = require("./controllers/topics.controller")
const { conGetArticleByID, conGetArticles, conPatchArticles } = require('./controllers/articles.controller')
const app = express();
const { handle404, handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./controllers/error.controller");
const { conPostComment, conGetComments, conDeleteComments } = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api", conGetAPI);

app.get("/api/topics", conGetTopics);

app.get("/api/articles/:article_id", conGetArticleByID);

app.get("/api/articles", conGetArticles)

app.get("/api/articles/:article_id/comments", conGetComments)

app.patch("/api/articles/:article_id", conPatchArticles)

app.post("/api/articles/:article_id/comments", conPostComment)

app.delete("/api/comments/:comment_id", conDeleteComments)


// Middleware


app.all('/*', handle404);

app.use(handlePostgresErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app