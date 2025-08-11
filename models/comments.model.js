const { use } = require("../app");
const db = require("../db/connection")
const format = require("pg-format");

exports.modGetCommentsbyArticle = (article_id) => {
    return db
        .query(`SELECT * FROM comments c WHERE c.article_id = $1 ORDER BY c.created_at ASC`, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

exports.modGetComments = (comment_id) => {
    return db
        .query(`SELECT * FROM comments c WHERE c.comment_id = $1`, [comment_id])
        .then(({ rows }) => {
            // console.log(rows, "<< model")
            return rows;
        })
}

exports.modPostComment = (article_id, body, username) => {
    return db
        .query(`SELECT * FROM users u WHERE u.username = $1`, [username])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 400, msg: "Incorrect user" })
            } else {
            return rows
            }
        })
        .then(() => {
            if (body) {
                const insertComment = format(
                    `INSERT INTO comments
                    (article_id, body, author)
                    VALUES
                    %L
                    RETURNING *`, [[article_id, body, username]]
                )
                return db.query(insertComment)
            } else {
                return Promise.reject({ status: 400, body: "Empty body" })
            }
        })
        .then(({ rows }) => {
            return rows[0];
        })
}

exports.modDeleteComments = (comment_id) => {
    return db.query(`SELECT * FROM comments c WHERE c.comment_id = $1`, [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No comment found" })
            } else {
                return db.query(`DELETE FROM comments c WHERE c.comment_id = $1`, [comment_id])
                    .then(({ rows }) => {
                        return rows;
                    })
            }
        })
}


exports.modPatchComments = (votes, comment_id) => {
    return db
        .query(`UPDATE comments c SET votes = votes + $1 WHERE c.comment_id = $2 RETURNING *`, [votes, comment_id])
        .then(({ rows }) => {
            return rows;
        })
}