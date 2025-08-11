const db = require("../db/connection");
const format = require("pg-format");

exports.modGetArticleByID = (article_id) => {
    return db
        .query(`SELECT a.article_id, a.title, a.topic,
    a.author, a.body, a.created_at, a.votes, a.article_img_url, 
    CAST(COUNT(c.article_id) AS INT) AS comment_count
    FROM articles a LEFT JOIN comments 
    c ON a.article_id = c.article_id WHERE a.article_id = $1 GROUP BY a.article_id `, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

exports.modGetArticles = (filter, by, sort, order) => {

    if (sort === undefined) {
        sort = 'created_at'
        order = 'desc'
    }

    const allowedSort = ["article_id", "created_at", "votes"]
    if (!allowedSort.includes(sort)) {
        return Promise.reject({ status: 400, msg: "Invalid query" })
    }
    
 if(filter !== undefined) {
    const allowedFilter = ["article_id", "title", "topic", "author"]
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

    if (filter && by) {
        queryValues.push(filter)
        queryValues.push(by)
        by = `'${by}'`
        queryStr += ` WHERE a.${filter} = ${by}`
    }
    if (queryValues.length === 2) {
        queryValues.push(sort)
        queryValues.push(order)
        queryStr += ` GROUP BY a.article_id ORDER BY a.${sort} ${order};`
    } else {
        queryValues.push(sort)
        queryValues.push(order)
        queryStr += ` GROUP BY a.article_id ORDER BY a.${sort} ${order};`
    }

    return db
        .query(queryStr)
        .then(({ rows }) => {
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