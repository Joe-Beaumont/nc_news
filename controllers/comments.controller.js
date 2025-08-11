const { modPostComment, modGetCommentsbyArticle, modDeleteComments, modPatchComments, modGetComments } = require("../models/comments.model")
const { modGetArticleByID } = require("../models/articles.model")

exports.conPostComment = (request, response, next) => {
    const { article_id } = request.params
    const { body, username } = request.body
    const regex = /\d/g
    if (regex.test(article_id)) {
        modGetArticleByID(article_id)
            .then((article) => {
                if (article.length === 0) {
                    return Promise.reject({ status: 404, msg: "No articles with that id" })
                }
                return modPostComment(article_id, body, username)
            })
            .then((comment) => {
                const { body } = comment
                return response.status(201).send({ comment: body })
            })
            .catch((err) => {
                next(err)
            })
    } else {
        return Promise.reject({ status: 400, msg: "Invalid id" })
            .catch((err) => {
                next(err);
            })
    }
}

exports.conGetCommentsbyArticle = (request, response, next) => {
    const { article_id } = request.params
    const regex = /\d/g
    if (regex.test(article_id)) {
        modGetCommentsbyArticle(article_id)
            .then((comments) => {
                if (comments.length === 0) {
                    return Promise.reject({ status: 404, msg: "No comments found" })
                } else {
                    response.status(200).send({ comments: comments })
                }
            }).catch((err) => {
                next(err)
            })
    } else {
        return Promise.reject({ status: 400, msg: "Invalid id" })
            .catch((err) => {
                next(err)
            })
    }
}

exports.conGetComments = (request, response, next) => {
    const { comment_id } = request.params
    const regex = /\d/g
    if (regex.test(comment_id)) {
        modGetComments(comment_id)
            .then((comment) => {
                if (comment.length === 0) {
                    return Promise.reject({ status: 404, msg: "No comments found" })
                } else {
                    response.status(200).send({ comment: comment[0] })
                }
            }).catch((err) => {
                next(err)
            })
    } else {
        return Promise.reject({ status: 400, msg: "Invalid id" })
            .catch((err) => {
                next(err)
            })
    }
}
exports.conDeleteComments = (request, response, next) => {
    const { comment_id } = request.params
    const regex = /\d/g
    if (regex.test(comment_id)) {
        modDeleteComments(comment_id)
            .then((empty) => {
                response.status(204).send(empty)
            })
            .catch((err) => {
                next(err)
            })
    } else {
        return Promise.reject({ status: 400, msg: "Invalid id" })
            .catch((err) => {
                next(err)
            })
    }

}

exports.conPatchComments = (request, response, next) => {
    const { comment_id } = request.params
    const { inc_votes } = request.body
    if (typeof inc_votes === "number") {
        modPatchComments(inc_votes, comment_id).then((comment) => {
            if (comment.length === 0) {
                return Promise.reject({ status: 404, msg: "No comments with that id" });
            } else {
                const updatedComment = comment[0]
                response.status(201).send({ updatedComment: updatedComment })
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