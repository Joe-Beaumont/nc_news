const db = require("./connection")
const seed = require('./seeds/seed');
const data = require('./data/development-data/index');

// Query all users
function queryUsers(){ 
    return db.query("SELECT * FROM users;")
    .then((result) => {
        console.log(result.rows)
    })
}

// queryUsers()


// All articles where topic is coding
function codingArticles(){ 
    return db.query(`
        SELECT * FROM articles
        WHERE topic = coding;`)
    .then((result) => {
        console.log(result.rows)
    })
}

codingArticles()
