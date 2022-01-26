/**
 *  @description - This schema is to store variety of variants ( all varieties of the same variant will be stored ) 
 */

const mongoose = require('mongoose');
const slugify = require('slugify')


const validate = require('../validate');

const Schema = mongoose.Schema;

const variantSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minlength: 1,
        validate: {
            validator: validate.validateString
        }
    },
    slug : String, //Used for view
    variantImage: {
        type: String,
        validate: {
            validator: validate.validateURL
        }
    },
    description: [{
        type: String,
        minlength: 1,
        validate: {
            validator: validate.validateString
        }
    }],
    campaigns: [{
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please provide a campaign id for the variant.'],
        select: false
    }] // Campaign IDs of campaigns run for this variant
});

//Creating Slug value from the name
variantSchema.pre('save' , function (next) {
    this.slug = slugify(this.name , {lower:true})
    next()
})

const Variant = new mongoose.model('Variant', variantSchema);

module.exports = { Variant };