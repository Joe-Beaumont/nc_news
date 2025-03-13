const { modGetUsers } = require("../models/users.model")

exports.conGetUsers = (request, response, next) => {
    modGetUsers()
    .then((users) => {
        if(users.length === 0){
            return Promise.reject({status: 404, msg: "No users found"})
        } else {
            response.status(200).send({ users: users })
        }
    }).catch((err) => {
        next(err)
    })
}