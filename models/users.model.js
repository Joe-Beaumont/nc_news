const db = require("../db/connection");

exports.modGetUsers = () => {
    return db
    .query(`SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}