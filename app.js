const express = require("express")
const { conGetAPI, conGetTopics } = require("./controllers/getControllers")
// const listen = require("./listen")
const app = express();

// listen();

app.get("/api", conGetAPI)

app.get("/api/topics", conGetTopics)

module.exports = app