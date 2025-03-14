const db = require("../db/connection");
const format = require("pg-format");

exports.modGetArticleByID = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

exports.modGetArticles = (filter, by, sort_by, order) => {

    if (sort_by === undefined) {
        sort_by = 'created_at'
        order = 'desc'
    }

    const allowedSort = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "article_img_url"]
    if (!allowedSort.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid query" })
    }
    
 if(filter !== undefined) {
    const allowedFilter = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "article_img_url"]
    if (!allowedFilter.includes(filter)) {
        return Promise.reject({ status: 400, msg: "Invalid query" })
    }
}

    const allowedDirections = ["asc", "ASC", "desc", "DESC"]
    if (!allowedDirections.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid query" })
    }

    let queryStr = `SELECT a.article_id, a.title, a.topic,
    a.author, a.created_at, a.votes, a.article_img_url, 
    CAST(COUNT(c.article_id) AS INT) AS comment_count
    FROM articles a LEFT JOIN comments 
    c ON a.article_id = c.article_id`

    const queryValues = []

    console.log(filter, by, sort_by, order)

    if (filter && by) {
        queryValues.push(filter)
        queryValues.push(by)
        by = `'${by}'`
        queryStr += ` WHERE a.${filter} = ${by}`
    }
    if (queryValues.length === 2) {
        queryValues.push(sort_by)
        queryValues.push(order)
        queryStr += ` GROUP BY a.article_id ORDER BY a.${sort_by} ${order};`
    } else {
        queryValues.push(sort_by)
        queryValues.push(order)
        queryStr += ` GROUP BY a.article_id ORDER BY a.${sort_by} ${order};`
    }

    console.log(queryStr)
    return db
        .query(queryStr)
        .then(({ rows }) => {
            console.log(rows)
            return rows;
        })
}



exports.modPatchArticles = (votes, article_id) => {
    return db
        .query(`UPDATE articles a SET votes = votes + $1 WHERE a.article_id = $2 RETURNING *`, [votes, article_id])
        .then(({ rows }) => {
            return rows;
        })
}