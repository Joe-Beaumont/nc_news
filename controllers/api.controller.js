const { modGetAPI } = require("../models/api.models")

const conGetAPI = (request, response) => {
    modGetAPI().then((endpoints) => {
        console.log(endpoints, "<< endpoints in controller")
        response.status(200).send({endpoints: endpoints})
    })
};

module.exports = { conGetAPI }