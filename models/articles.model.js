const db = require("../db/connection");

const modGetArticleByID = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not a valid id" });
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
                return promises.reject({ status: 404, msg: "No articles found" })
            } else {
                rows.forEach((article) => {
                    article.comment_count = Number(article.comment_count)
                })
                return rows
            }
        })
}

module.exports = { modGetArticleByID, modGetArticles }