const { modGetTopics } = require("../models/topics.model");

exports.conGetTopics = (request, response) => {
    modGetTopics().then((topics)=> {
        response.status(200).send({topics: topics})
    }).catch((err) => {
        console.log(err)
        next(err)
    })
}