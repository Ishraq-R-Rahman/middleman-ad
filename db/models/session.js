const mongoose = require('mongoose');

const validate = require('../validate');

const sessionSchema = new mongoose.Schema({
    events: [{
        name: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            required: true
        },
        scrapedData: new mongoose.Schema({
            name : {
                type: String,
                required: true,
                minlength: 1,
                validate: {
                    validator: validate.validateString
                }
            },  
            source : {
                type: String,
                required: [true, "Please provide a source for the data"],
                minlength: 1,
                validate: {
                    validator: validate.validateString
                }
            },
            finalPrice : {
                type: String,
                required: [true, "Please provide a final_price for the data"],
                minlength: 1,
                validate: {
                    validator: validate.validateString
                } 
            },
            originalPrice : {
                type: String,
                minlength: 1,
                validate: {
                    validator: validate.validateString
                } 
            },
            discount: {
                type: Number
            },
            url: {
                type: String,
                required: [true, "Please provide a final_price for the data"],
                validate: {
                    validator: validate.validateURL
                }
            }
        }, {
            required: false
        })
    }],
    campaign: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campaign'
    },
    device: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    },
    source: {
        type: String,
        required: true
    },
    cookie: {
        type: String,
        unique: true
    }
});



const Session = new mongoose.model('Session', sessionSchema);

module.exports = { Session }