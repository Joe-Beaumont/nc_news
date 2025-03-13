function handle404(req, res, next){
    res.status(404).send({msg: "Page does not exist"}) 
};

function handlePostgresErrors(err, req, res, next){
    if (err.code === "22PO2") {
        res.status(400).send({msg: "Invalid Input"});
    } else {
        next(err);
    }
};

function handleCustomErrors(err, req, res, next){
    if(err){
    // console.log(err);
    res.status(err.status).send({msg: err.msg});
    }
    else {
        next(err);
    }
};

function handleServerErrors(err, req, res, next){
    // console.log(err);
    res.status(500).send({msg: "Internal server error"});
};

module.exports = { handle404, handlePostgresErrors, handleCustomErrors, handleServerErrors };