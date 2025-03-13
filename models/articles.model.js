const db = require("../db/connection");

exports.modGetArticleByID = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

exports.modGetArticles = () => {
    return db
        .query(`SELECT a.article_id, a.title, a.topic,
         a.author, a.created_at, a.votes, a.article_img_url, 
         CAST(COUNT(c.article_id) AS INT) AS comment_count 
         FROM articles a LEFT JOIN comments 
         c ON a.article_id = c.article_id 
         GROUP BY a.article_id 
         ORDER BY a.created_at desc`)
        .then(({ rows }) => {
            return rows
        })
}

exports.modPatchArticles = (votes, article_id) => {
    return db
        .query(`UPDATE articles a SET votes = votes + $1 WHERE a.article_id = $2 RETURNING *`, [votes, article_id])
        .then(({ rows }) => {
            return rows;
        })
}