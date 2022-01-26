// TODO: Write handlers
const variantInterface = require('../db/interfaces/variantInterface')

/**
 *
 * @param req - Request from api call
 * @param res - Response for api call
 * @returns list of variant with { name , variant }
 */
const handleGETVariant = async (req, res) => {
    try {
        const variantQueryResult = await variantInterface.findVariantById(req.params.id);

        if (variantQueryResult.status === 'OK') {
            let variant = variantQueryResult.data;

            //SCRAPING THE WEBSITE
            let runCrawler = require('../scripts/runCrawler')
            let listOfVariants = await runCrawler.runScript()

            //can figure out discount but easier to do in front end i think
            // await listOfVariants.forEach((item)=>{
            //     item.variant.discount = (parseInt( (item.original_price - item.final_price ) ) * 100 / parseInt(item.original_price )).toString()
            // })
            // console.log(listOfVariants)
            
            return res.status(200).send({
                status: 'OK',
                message: variantQueryResult.message,
                variant,
                listOfVariants
            });
        }

        return res.status(400).send({
            status: variantQueryResult.status,
            message: variantQueryResult.message
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}


/**
 *
 *
 * @param req - Request from api call
 * @param res - Response for api call
 * @returns Variants - returns the list of available variants
 */
const handleGETAllVariants = async (req, res) => {

    try {
        const variantQueryResult = await variantInterface.findAllVariants()

        if (variantQueryResult.status === 'OK') {
            let variant = variantQueryResult.data
            let count = variantQueryResult.count

            return res.status(200).send({
                status: 'OK',
                message: variantQueryResult.message,
                count,
                variant
            });
        }

        return res.status(400).send({
            status: variantQueryResult.status,
            message: variantQueryResult.message
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
};

/**
 *
 * @param req - Request from api call
 * @param res - Response for api call
 * @returns {Promise<*>}
 */
const handlePOSTCreateVariant = async (req, res) => {
    try {
        const variantQueryResult = await variantInterface.addVariant(req.body)

        if (variantQueryResult.status === 'OK') {
            let variant = variantQueryResult.data;

            return res.status(201).send({
                status: 'OK',
                message: variantQueryResult.message,
                variant
            });
        }

        return res.status(400).send({
            status: variantQueryResult.status,
            message: variantQueryResult.message
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}

/**
 * @description - This route updates the variant
 * @route - PUT /api/variants/:variantId
 * @param req - Request from api call
 * @param res - Response for api call
 * @access private
 */
const handlePUTUpdateVariant = async (req, res) => {
    try {

        if( req.body.campaigns ){
            return res.status(400).send({
                status: "ERROR",
                message: "Campaigns can't be updated in this route"
            });
        }

        const variantQueryResult = await variantInterface.updateVariant( req.params.variantId , req.body )

        if (variantQueryResult.status === 'OK') {
            let variant = variantQueryResult.data;

            return res.status(200).send({
                status: 'OK',
                message: variantQueryResult.message,
                variant
            });
        }

        return res.status(400).send({
            status: variantQueryResult.status,
            message: variantQueryResult.message
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}





module.exports = {
    handleGETAllVariants,
    handlePUTUpdateVariant
}