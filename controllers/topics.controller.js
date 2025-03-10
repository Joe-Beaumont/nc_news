const { modGetTopics } = require("../models/topic.models");

const conGetTopics = (request, response) => {
    modGetTopics().then((topics)=> {
        console.log(topics, "<< topics in controller")
        response.status(200).send({topics: topics})
    }).catch((err) => {
        console.log(err)
        next(err)
    })
}



module.exports = { conGetTopics }