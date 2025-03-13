const { modGetAPI } = require("../models/api.model")

exports.conGetAPI = (request, response) => {
    response.status(200).send({ endpoints: modGetAPI() })
};
