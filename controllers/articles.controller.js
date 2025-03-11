const { modGetArticleByID } = require("../models/articles.model")

const conGetArticleByID = (request, response, next) => {
    const {article_id} = request.params
    modGetArticleByID(article_id).then((article) => {
        console.log(article)
        response.status(200).send({article: article})
    }).catch((err) => {
        // console.log(err)
        next(err);
    })
}

module.exports = { conGetArticleByID }