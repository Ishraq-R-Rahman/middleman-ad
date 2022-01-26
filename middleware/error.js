const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req,res, next )=>{
    // console.log(err);

    let error = { ...err }
    error.message = err.message

    //Mongoose bad ObjectID
    if( err.name === 'CastError' ){
        const message = `Product with id ${err.value} not found.`
        error = new ErrorResponse( message , 404 )
    }

    //Duplicate Error
    if( err.code === 11000 ){
        const message = `Duplicate Name`
        error = new ErrorResponse( message , 400 )
    }

    // console.log(err);

    //Mongoose Validation Error
    if( err.name === 'ValidationError'){
        const message = Object.values(err.errors).map( val => val.message )
        error = new ErrorResponse( message , 400 )
    }

    res.status( error.statusCode || 500 ).json({
        success: false,
        data: null,
        error: error.message || 'Server Error'
    })


}

module.exports = errorHandler