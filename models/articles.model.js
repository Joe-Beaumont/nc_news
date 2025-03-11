const db = require("../db/connection");

const modGetArticleByID = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        console.log(rows)
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Not a valid id"});
        } else {
            return rows
        }
    })
}

module.exports= { modGetArticleByID }