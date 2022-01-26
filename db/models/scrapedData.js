// TODO: Write campaign schema 
const mongoose = require('mongoose')

const validate = require('../validate');

const Schema = mongoose.Schema


const scrapedDataSchema = new Schema({
    name : {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        validate: {
            validator: validate.validateString
        }
    },
    variantID: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please provide a variant id for the scraped variant.']
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
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    campaigns: [{
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please provide a campaign id for the scraped variant.'],
        select: false
    }] // Campaign IDs of campaigns run for this variant
    
})

// This will make sure the data gets deleted after a certain amonut of time
scrapedDataSchema.index({
    createdAt: 1 // 1 = ascending order
}, {
    expireAfterSeconds: 7200 // the data will be expired after 2 hours
})

const ScrapedData = new mongoose.model('ScrapedData', scrapedDataSchema )

module.exports = { ScrapedData }
