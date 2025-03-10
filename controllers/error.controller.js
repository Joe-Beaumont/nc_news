function handle404(req, res, next){
    res.status(404).send({msg: "Page does not exist"}) 
};

function customErrors(err, req, res, next){
    if(err.status && err.msg){
    console.log(err);
    res.status(err.status).send({msg: err.msg}) 
    }
    else {
        console.log(err)
        res.status(500).send({msg: "Internal Server Error"})
    }
}

function handle500(err, req, res, next){
    console.log(err);
    res.send({msg: "Internal server error"}) 
};

module.exports = { handle404, customErrors, handle500 };