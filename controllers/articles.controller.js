const { modGetArticleByID, modGetArticles, modPatchArticles } = require("../models/articles.model")

exports.conGetArticleByID = (request, response, next) => {
    const { article_id } = request.params
    modGetArticleByID(article_id).then((article) => {
        if (article.length === 0) {
            return Promise.reject({ status: 404, msg: "No articles with that id" })
        } else {
            response.status(200).send({ article: article })
        }
    }).catch((err) => {
        next(err);
    })
}

exports.conGetArticles = (request, response, next) => {
    // const query1 = (Object.keys(request.query))[0]
    // const query2 = request.query[query1]

    const { filter } = request.query
    const { by } = request.query
    const { sort_by } = request.query
    const { order } = request.query

    modGetArticles(filter, by, sort_by, order)
        .then((articles) => {
            if (articles.length === 0) {
                return Promise.reject({ status: 404, msg: "No articles found" })
            } else {
                response.status(200).send({ articles: articles })
            }
        }).catch((err) => {
            next(err);
        })

}

exports.conPatchArticles = (request, response, next) => {
    const { article_id } = request.params
    const { inc_votes } = request.body
    if (typeof inc_votes === "number") {
        modPatchArticles(inc_votes, article_id).then((article) => {
            if (article.length === 0) {
                return Promise.reject({ status: 404, msg: "No articles with that id" });
            } else {
                const updatedArticle = article[0]
                response.status(201).send({ updatedArticle: updatedArticle })
            }
        })
            .catch((err) => {
                next(err);
            })
    } else {
        return Promise.reject({ status: 400, msg: "Votes provided not a number" })
            .catch((err) => {
                next(err);
            })
    }
}