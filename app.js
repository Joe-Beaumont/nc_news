const express = require("express")
const { conGetAPI } = require("./controllers/api.controller")
const { conGetTopics } = require("./controllers/topics.controller")
const { conGetArticleByID } = require('./controllers/articles.controller')
const app = express();
const { handle404, handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./controllers/error.controller")


app.get("/api", conGetAPI);

app.get("/api/topics", conGetTopics);

app.get("/api/articles/:article_id", conGetArticleByID);


app.all('/*', handle404)

app.use(handlePostgresErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app