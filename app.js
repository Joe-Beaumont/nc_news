const express = require("express")
const { conGetAPI } = require("./controllers/api.controller")
const { conGetTopics } = require("./controllers/topics.controller")

const app = express();
const { handle404, customErrors, handle500 } = require("./controllers/error.controller")


app.get("/api", conGetAPI)

app.get("/api/topics", conGetTopics)

app.all('/*', handle404)

app.use(handle500)

module.exports = app