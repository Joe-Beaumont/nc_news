const db = require("../db/connection")
// const format = require("pg-format");

const modPostComment = (article_id, body, username) => {
    if (body) {
        // const insertComment = format(
        //     `INSERT INTO comments
        //     (article_id, body, author)
        //     VALUES
        //     %L
        //     RETURNING *`, [article_id, body, username]
        // )
        // Username is a foreign key?  Won't let me insert a value here
        // // console.log(insertComment, "INSERT")
        return db.query(`INSERT INTO comments (article_id, body) VALUES ($1, $2) RETURNING *`, [article_id, body])
            .then(({ rows }) => {
                return rows[0];
            })
    } else {
        return Promise.reject({ status: 400, body: "Incorrect user or empty body" })
    }
}

module.exports = { modPostComment }