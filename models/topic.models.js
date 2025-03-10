const db = require("../db/connection");

const modGetTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        console.log(rows, "<< rows model")
        return rows
    })
}
module.exports = { modGetTopics }