const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");

exports.modGetAPI = () => {
    return endpointsJson;
}