const { modGetAPI } = require("../models/api.model")

const conGetAPI = (request, response) => {
    modGetAPI().then((endpoints) => {
        response.status(200).send({endpoints: endpoints})
    })
};

module.exports = { conGetAPI }