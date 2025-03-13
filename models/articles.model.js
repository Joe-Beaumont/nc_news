const { get } = require("../app");
const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");
const format = require("pg-format");

exports.modGetArticleByID = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

exports.modGetArticles = (sort_by = "created_at", order = "desc") => {
    const getArticles = format(
        `SELECT a.article_id, a.title, a.topic,
        a.author, a.created_at, a.votes, a.article_img_url, 
        CAST(COUNT(c.article_id) AS INT) AS comment_count 
        FROM articles a LEFT JOIN comments 
        c ON a.article_id = c.article_id 
        GROUP BY a.article_id 
        ORDER BY %I %s`, sort_by, order
    )
        return db
        .query(getArticles)
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