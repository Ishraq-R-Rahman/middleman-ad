const mongoose = require('mongoose')

let turnIntoObjectId = ( string ) => {
    
    let objectId = (string.length > 24)? string.slice( 0 , -(str.length-24) ): mongoose.Types.ObjectId().toString().slice(0,-string.length) + string
    return objectId
}

module.exports = {
    turnIntoObjectId
}