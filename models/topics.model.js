const db = require("../db/connection");

const modGetTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}
module.exports = { modGetTopics }