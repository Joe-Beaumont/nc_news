const { modPostComment, modGetComments, modDeleteComments } = require("../models/comments.model")
const { modGetArticleByID } = require("../models/articles.model")

const conPostComment = (request, response, next) => {
    const { article_id } = request.params
    const { body, username } = request.body
    const regex = /\d/g

    if(regex.test(article_id)){
        
        modGetArticleByID(article_id)
        .then((article) => {
            if (article.length === 0) {
                return Promise.reject({ status: 404, msg: "No article found" })
                .catch((err) => {
                    next(err);
                })
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
    } else {
        return Promise.reject({ status: 400, msg: "Invalid id" })
        .catch((err) => {
            next(err);
        })
    }
}

const conGetComments = (request, response, next) => {
    const { article_id } = request.params
    const regex = /\d/g
    if(regex.test(article_id)){
        modGetComments(article_id)
        .then((comments) => {
            response.status(200).send({comments: comments})
        }).catch((err) => {
            next(err)
        })
    } else {
        return Promise.reject({ status: 400, msg: "Invalid id" })
        .catch((err) => {
            next(err)})
    }
}

const conDeleteComments = (request, response, next) => {
    const { comment_id } = request.params
    const regex = /\d/g
    if(regex.test(comment_id)){
        modDeleteComments(comment_id)
        .then((empty) => {
            response.status(204).send(empty)
        })
        .catch((err) => {
            next(err)})
    } else {
        return Promise.reject({ status: 400, msg: "Invalid id" })
        .catch((err) => {
            next(err)})
    }
    
}


module.exports = { conPostComment, conGetComments, conDeleteComments }