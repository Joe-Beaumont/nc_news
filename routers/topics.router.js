const topicsRouter = require("express").Router();

const { topicController } = require("../controllers/index")

topicsRouter
.route("/")
.get(topicController.conGetTopics)

module.exports = topicsRouter;