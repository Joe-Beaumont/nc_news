const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");

const modGetAPI = () => {
    return db.query(`SELECT * FROM users`)
    .then(() => {
        return endpointsJson;
    })
}
module.exports = { modGetAPI }