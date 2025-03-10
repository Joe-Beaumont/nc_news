const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");

const modGetAPI = () => {
    return db.query(`SELECT * FROM users`)
    .then(() => {
        return endpointsJson;
    })
}

const modGetTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        console.log(rows, "<< rows model")
        return rows
    })
}
module.exports = { modGetAPI, modGetTopics }