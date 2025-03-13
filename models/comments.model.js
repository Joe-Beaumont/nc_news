const db = require("../db/connection")
// const format = require("pg-format");

const modGetComments = (article_id) => {
    return db
        .query(`SELECT * FROM comments c WHERE c.article_id = $1 ORDER BY c.created_at ASC`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No comments found" })
            } else {
                return rows;
            }
        })
}

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

const modDeleteComments = (comment_id) => {
    return db.query(`SELECT * FROM comments c WHERE c.comment_id = $1`, [comment_id])
    .then(({ rows }) => {
        console.log(rows)
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No comment found" })
        } else {
            return db.query(`DELETE FROM comments c WHERE c.comment_id = $1`, [comment_id])
            .then(( { rows }) => {
                console.log(rows)
                return rows;
            })
        }
    })
}

module.exports = { modPostComment, modGetComments, modDeleteComments }