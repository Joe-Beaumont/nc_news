const { modGetTopics } = require("../models/topics.model");

const conGetTopics = (request, response) => {
    modGetTopics().then((topics)=> {
        response.status(200).send({topics: topics})
    }).catch((err) => {
        console.log(err)
        next(err)
    })
}



module.exports = { conGetTopics }