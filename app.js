const express = require("express")
const { conGetAPI } = require("./controllers/getControllers")
// const listen = require("./listen")
const app = express();

// listen();

app.get("/api", conGetAPI)

module.exports = app