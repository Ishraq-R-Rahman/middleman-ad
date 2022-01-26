// TODO: Write campaign schema 
const mongoose = require('mongoose')

const validate = require('../validate');

const Schema = mongoose.Schema

const campaignSchema = new Schema({
    //Will be dealt using campaign id
    // campaignCode : {
    //     type: String,
    //     // unique: true,
    //     required: true,
    //     minlength: 1,
    //     validate: {
        //         validator: validate.validateString
    //     }
    // },
    brand: {
        type: String,
        required: true,
        minlength: 1,
        validate: {
            validator: validate.validateString
        }
    },
    bannerImage: {
        type: String,
        validate: {
            validator: validate.validateURL
        }
    },
    video: {
        type: String,
        validate: {
            validator: validate.validateURL
        }
    },
    productName: {
        type: String,
        required: true,
        minlength: 1,
        validate: {
            validator: validate.validateString
        }
    },
    logo: {
        type: String,
        validate: {
            validator: validate.validateURL
        }
    },
    placement : {
        // This is going to be a unique identifier for the landing page ( using url for now )
        type: String,
        validate: {
            validator: validate.validateURL
        }
    },
    count : {
        // the number of times the action specified in the 'action' field occured today
        type : Number 
    }

},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
)

campaignSchema.pre('remove', async function( next ){
    await this.model('Variant').updateMany( {campaigns: this._id} , {$pullAll: { campaigns : [this._id]} } );
    await this.model('Variant').deleteMany( { campaigns: {$exists: true, $size : 0 } } ) // removes the variant with no campaign id
    await this.model('ScrapedData').updateMany( {campaigns: this._id} , {$pullAll: { campaigns : [this._id]} } );
    await this.model('ScrapedData').deleteMany( { campaigns: {$exists: true, $size : 0 } } ) // removes the scraped data with no campaign id
    next();
})

campaignSchema.virtual('variantsList', {
    ref: 'Variant',
    localField: '_id',
    foreignField: 'campaigns',
    justOne: false
})

const Campaign = new mongoose.model('Campaign', campaignSchema )

module.exports = { Campaign }
