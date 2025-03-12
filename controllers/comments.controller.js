const { modPostComment } = require("../models/comments.model")
const { modGetArticleByID } = require("../models/articles.model")

const conPostComment = (request, response, next) => {
    const { article_id } = request.params
    const { body, username } = request.body
    modGetArticleByID(article_id)
    .then((article) => {
        if (article.length === 0) {
            return Promise.reject({ status: 404, msg: "Not a valid id" })
        } else {
        const { title } = article[0];

        return modPostComment(article_id, body, username)
            .then((comment) => {
                const { body } = comment
                return response.status(201).send({ comment: body })
            }).catch((err) => {
                next(err);
            })
        }
    })
}




module.exports = { conPostComment }