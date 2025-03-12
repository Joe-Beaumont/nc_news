const { modGetArticleByID, modGetArticles, modPatchArticles } = require("../models/articles.model")

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

const conPatchArticles = (request, response, next) => {
    const { article_id } = request.params
    const { inc_votes } = request.body
        modPatchArticles(inc_votes, article_id).then((article) => {
            const updatedArticle = article[0]
            response.status(201).send({updatedArticle: updatedArticle})
        })
        .catch((err) =>{
            next(err);
        })
}

module.exports = { conGetArticleByID, conGetArticles, conPatchArticles }