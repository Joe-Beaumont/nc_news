const { modGetAPI, modGetTopics } = require("../models/getModels");

const conGetAPI = (request, response) => {
    modGetAPI().then((endpoints) => {
        console.log(endpoints, "<< endpoints in controller")
        response.status(200).send({endpoints: endpoints})
    })
};
const conGetTopics = (request, response) => {
    modGetTopics().then((topics)=> {
        console.log(topics, "<< topics in controller")
        response.status(200).send({topics: topics})
    })
}



module.exports = { conGetAPI, conGetTopics }