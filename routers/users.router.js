const usersRouter = require("express").Router();

const { userController } = require("../controllers/index")

usersRouter
.route("/")
.get(userController.conGetUsers);

module.exports = usersRouter;