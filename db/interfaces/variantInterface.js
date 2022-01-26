// TODO: Write interface methods
const Variant = require('../models/variant').Variant

/**
 * This function takes an id as parameter and returns the Variant document
 * that matches the provided id.
 *
 * @param id - The _id of the variant document to be queried
 * @returns Variant - The variant whose _id matches the provided id
 */
const findVariantById = async (id) => {
    try {
        let variant = await Variant.findById(id);

        if (variant) {
            return {
                data: variant,
                status: 'OK',
                message: 'Variant with provided id queried successfully'
            }
        }

        return {
            data: null,
            status: 'ERROR',
            message: 'Variant with provided id does not exist'
        };
    } catch (e) {

        return {
            data: null,
            status: 'EXCEPTION',
            message: e.message
        };
    }
}

/**
 * This function takes a query object and an option object as parameters 
 * and returns the Variant documents that match the query,
 * with attributes filtered using the option object.
 *
 * @param query - The query parameters used to query the database for variants
 * @param option - The option filter that is used to filter out attributes
 * @returns [Variant] - An array of Variants
 */
const findVariantsByQuery = async (query, option) => {
    try {
        let data = await Variant.find(query, option);
        let message = data.length > 0 ? 'Variants Found' : 'Variant Not Found';
        return {
            data,
            message,
            status: 'OK'
        };
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'EXCEPTION'
        }
    }
};


/**
 * This function takes a query object and an option object as parameters 
 * and returns the first Variant document that matches the query,
 * with attributes filtered using the option object.
 *
 * @param query - The query parameters used to query the database for a variant
 * @param option - The option filter that is used to filter out attributes
 * @returns Variant - A Variant
 */
const findVariantByQuery = async (query, option) => {
    try {
        let data = await Variant.findOne(query, option);
        if (data){
            return {
                data,
                message: 'Variant Found',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'Variant Not Found',
                status: 'ERROR'
            }
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'EXCEPTION'
        }
    }
};


/**
 * This function returns a list of all the variants available
 *
 * @returns Variants - list of all the variants that are available
 */
const findAllVariants = async () => {
    try {
        let variant = await Variant.find();

        if (variant) {
            return {
                data: variant,
                count: variant.length,
                status: 'OK',
                message: 'List of all variants queried successfully'
            }
        }

        return {
            data: null,
            count: 0,
            status: 'ERROR',
            message: 'List of variants could not be found'
        };
    } catch (e) {

        return {
            data: null,
            count: 0,
            status: 'EXCEPTION',
            message: e.message
        };
    }
}

/**
 * This function takes the body of the request as a parameter and adds a newly created variant to the database.
 *
 * @param body - Body of the request is sent as a parameter
 * @returns Variant - returns the variant that has been added to the database
 */

const addVariant = async (variantsList) => {

    try {
        // let variants = await Variant.create( variantsList )

        // Inserts a list of variants, either updates or creates
        let variants = await Variant.bulkWrite(variantsList.map(variant =>
        ({
            updateOne: {
                filter: {
                    name: variant.name,
                    variantImage: variant.variantImage,
                    description: variant.description
                },
                // update: { $push: { campaigns : variant.campaign } },
                update: { $addToSet: { campaigns: variant.campaign } }, // Adds the value only if it's not already present in the array
                upsert: true
            }
        })
        ));

        if (variants.ok === 1) {
            return {
                data: variantsList,
                status: 'OK',
                message: 'A new variants list has been inserted into the database'
            }
        }

        return {
            data: null,
            status: 'ERROR',
            message: 'New variants could not be inserted into the database'
        };
    } catch (e) {

        return {
            data: null,
            status: 'EXCEPTION',
            message: e.message
        };
    }
}

/**
 * @description - This method removes the campaigns using the campaignid from the variants
 * @param campaignId 
 */
const removeCampaigns = async (campaignId) => {
    const variants = await Variant.updateMany({ campaigns: campaignId }, { $pullAll: { campaigns: [campaignId] } })
    // console.log(variants.n);
    //Number of docs matched
    if (variants.n > 0) {
        return true
    }
    return false;
}


/**
 * @description - Updates a single variant
 * @param variantId 
 * @param body 
 */
const updateVariant = async (variantId, body) => {
    try {
        let variant = await Variant.findById(variantId)

        if (variant) {
            variant = await Variant.findByIdAndUpdate(variantId, body, {
                new: true,
                runValidators: true
            })

            return {
                data: variant,
                status: 'OK',
                message: 'The desired variant has been updated into the database'
            }
        }

        return {
            data: null,
            status: 'ERROR',
            message: 'New variants could not be inserted into the database'
        };
    } catch (e) {

        return {
            data: null,
            status: 'EXCEPTION',
            message: e.message
        };
    }
}



module.exports = {
    findVariantById,
    findAllVariants,
    addVariant,
    removeCampaigns,
    updateVariant
}
