const db = require("../connection")
const format = require ("pg-format");
const utils = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
  .then(()=> {
    return db.query("DROP TABLE IF EXISTS articles;");
  })
  .then(()=> {
    return db.query("DROP TABLE IF EXISTS users;");
  })
  .then(()=> {
    return db.query("DROP TABLE IF EXISTS topics;");
  })
  .then(()=> {
    return createTopics();
  })
  .then(()=> {
    return createUsers();
  })
  .then(()=> {
    return createArticles();
  })
  .then(()=> {
    return createComments();
  })
  // Insert Topics Data
  .then(()=> {
    const mappedTopics = topicData.map((topic) => {
      return [topic.slug, topic.description, topic.img_url]
    })
    const insertTopics = format(
      `INSERT INTO topics
      (slug, description, img_url)
      VALUES
      %L
      RETURNING *;`,
      mappedTopics
    );
    return db.query(insertTopics)
  })
  // Insert Users Data
  .then(()=> {
    const mappedUsers = userData.map((user) => {
      return [user.username, user.name, user.avatar_url]
    })
    const insertUsers = format(
      `INSERT INTO users
      (username, name, avatar_url)
      VALUES
      %L
      RETURNING *;`,
      mappedUsers
    );
    return db.query(insertUsers)
  })
  // Insert articles data
  .then((usersResponse)=> {
    // Access to topics and users
    //Mapping articles (including changing timestamp)
    const mappedArticles = articleData.map((article) => {
        const updatedArticle = utils.convertTimestampToDate(article);
      return [
        updatedArticle.title,
        updatedArticle.topic,
        updatedArticle.author,
        updatedArticle.body,
        updatedArticle.created_at,
        updatedArticle.votes,
        updatedArticle.article_img_url
      ]
    })
    console.log(mappedArticles)
    // Inserting into table
    const insertArticles = format(
      `INSERT INTO articles
      (title, topic, author, body, created_at, votes, article_img_url)
      VALUES
      %L
      RETURNING *;`,
      mappedArticles
    );
    return db.query(insertArticles)
  })
    // Insert comments data
  .then((articlesResponse) => {
    //Access to articles and users
    const articles = articlesResponse.rows
    // Creating ref objects
    const article_id = utils.createRefObject(
      articles,
      "title",
      "article_id"
    );
    // console.log(article_id)
    // mapping comments (including converting timestamp)
    const mappedComments = commentData.map((comment) => {
      const updatedComment = utils.convertTimestampToDate(comment);
      return [
        // updatedComment.comment_id,
        article_id[updatedComment.article_title],
        updatedComment.body,
        updatedComment.votes,
        updatedComment.author,
        updatedComment.created_at
      ]
    })

    // console.log(mappedComments)
    // Inserting into table
    const insertComments = format(
      `INSERT INTO comments
      (article_id, body, votes, author, created_at)
      VALUES
      %L
      RETURNING *;`,
      mappedComments
    );
    return db.query(insertComments)
  })
};

function createTopics (){
  return db.query(`CREATE TABLE topics (
    slug VARCHAR(40) PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    img_url VARCHAR(1000)
    );`)
}

function createUsers (){
return db.query(`CREATE TABLE users (
  username VARCHAR(40) PRIMARY KEY UNIQUE,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(1000) NOT NULL
  );`)
}

function createArticles(){
  return db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY UNIQUE,
    title VARCHAR(100) NOT NULL,
    topic VARCHAR(40) REFERENCES topics(slug),
    author VARCHAR(40) REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
    );`)
}

function createComments(){
return db.query(`CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY UNIQUE,
  article_id SERIAL REFERENCES articles(article_id),
  body TEXT NOT NULL,
  votes INT DEFAULT 0,
  author VARCHAR(40) REFERENCES users(username),
  created_at TIMESTAMP
  );`)
}


module.exports = seed;
