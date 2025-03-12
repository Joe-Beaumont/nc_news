const db = require("../db/connection");

const modGetArticleByID = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No articles with that id" });
            } else {
                return rows;
            }
        })
}

const modGetArticles = () => {
    return db
        .query(`SELECT a.article_id, a.title, a.topic,
         a.author, a.created_at, a.votes, a.article_img_url, 
         COUNT(c.article_id) AS comment_count 
         FROM articles a LEFT JOIN comments 
         c ON a.article_id = c.article_id 
         GROUP BY a.article_id 
         ORDER BY a.created_at desc`)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No articles found" })
            } else {
                rows.forEach((article) => {
                    article.comment_count = Number(article.comment_count)
                })
                return rows
            }
        })
}

const modPatchArticles = (votes, article_id) => {
    if (typeof votes === "number") {
        return db
            .query(`UPDATE articles a SET votes = votes + $1 WHERE a.article_id = $2 RETURNING *`, [votes, article_id])
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "No articles with that id" });
                } else {
                    return rows;
                }
            })
    } else {
        return Promise.reject({ status: 400, msg: "Votes provided not a number" })
    }
}

module.exports = { modGetArticleByID, modGetArticles, modPatchArticles }