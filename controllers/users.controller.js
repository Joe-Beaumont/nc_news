const { modGetUsers } = require("../models/users.model")

exports.conGetUsers = (request, response, next) => {
    modGetUsers()
    .then((users) => {
            response.status(200).send({ users: users })
    }).catch((err) => {
        next(err)
    })
}