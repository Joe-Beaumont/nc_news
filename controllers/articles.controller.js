const { modGetArticleByID, modGetArticles } = require("../models/articles.model")

const conGetArticleByID = (request, response, next) => {
    const {article_id} = request.params
    modGetArticleByID(article_id).then((article) => {
        response.status(200).send({article: article})
    }).catch((err) => {
        next(err);
    })
}

const conGetArticles = (request, response, next) => {
    modGetArticles().then((articles) => {
        response.status(200).send({articles: articles})
    }).catch((err) =>{
        next(err);
    })
}

module.exports = { conGetArticleByID, conGetArticles }