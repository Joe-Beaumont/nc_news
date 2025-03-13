const db = require("../db/connection");
const format = require("pg-format");

exports.modGetArticleByID = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

exports.modGetArticles = (query1 = "created_at", query2 = "desc") => {

    const allowedInputs = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "article_img_url"]
    if (!allowedInputs.includes(query1)) {
        return Promise.reject({ status: 400, msg: "Invalid query" })
    }
    if (query2 === "desc" || query2 ===  "asc" || query2 ===  "ASC" || query2 ===  "DESC") {
        const sortArticles = format(
            `SELECT a.article_id, a.title, a.topic,
                    a.author, a.created_at, a.votes, a.article_img_url, 
                    CAST(COUNT(c.article_id) AS INT) AS comment_count 
                    FROM articles a LEFT JOIN comments 
                    c ON a.article_id = c.article_id 
                    GROUP BY a.article_id 
                    ORDER BY %I %s`, query1, query2
        )
        return db
            .query(sortArticles)
            .then(({ rows }) => {
                return rows
            })
    } else {
    const filterBy = format(`SELECT a.article_id, a.title, a.topic,
                    a.author, a.created_at, a.votes, a.article_img_url, 
                    CAST(COUNT(c.article_id) AS INT) AS comment_count
                    FROM articles a LEFT JOIN comments 
                    c ON a.article_id = c.article_id 
                    WHERE %I = %L 
                    GROUP BY a.article_id 
                    ORDER BY a.created_at desc`, query1, query2)
    return db
        .query(filterBy)
        .then(({ rows }) => {
            return rows
        })
    }
}

exports.modPatchArticles = (votes, article_id) => {
    return db
        .query(`UPDATE articles a SET votes = votes + $1 WHERE a.article_id = $2 RETURNING *`, [votes, article_id])
        .then(({ rows }) => {
            return rows;
        })
}