const campaignInterface = require('../db/interfaces/campaignInterface')
const variantInterface = require('../db/interfaces/variantInterface')
const scrapedDataInterface = require('../db/interfaces/scrapedDataInterface')
const objectIdConverter = require('../utils/objectIdGenerator').turnIntoObjectId

/**
 * @description - Creates a new campaign 
 * @route - POST /api/campaigns
 * @param req - Req.body will include ( campaign code , brand , variants in the campaign and the landing page url )
 * @param res - Response for the api call
 * @param next 
 */
const handlePOSTCampaign = async (req, res, next) => {
    try {
        req.body._id = objectIdConverter( req.body._id )
        const campaignQueryResult = await campaignInterface.insertCampaign(req.body)
        const variantsList = req.body.variants
        variantsList.forEach(variant => {
            variant['campaign'] = campaignQueryResult.data._id
        })
        const variantQueryResult = await variantInterface.addVariant(variantsList)

        if (campaignQueryResult.status === 'OK' && variantQueryResult.status === "OK") {
            return res.status(201).send({
                status: 'OK',
                message: campaignQueryResult.message + variantQueryResult.message,
                campaign: campaignQueryResult.data,
                variants: variantQueryResult.data
            });
        }

        return res.status(400).send({
            status: campaignQueryResult.status,
            message: campaignQueryResult.message + variantQueryResult.message
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}

/**
 * @description - Gets a campaign 
 * @route - GET /api/campaigns/:campaignId
 * @param req - Request for the api call
 * @param res - responds with the campaigns detail and the variants involved in the campaign. Also will scrape the variants.
 * @param next 
 */
const handleGETCampaign = async (req, res, next) => {
    try {
        const campaignQueryResult = await campaignInterface.findCampaign(req.params.campaignId)
        if (campaignQueryResult.status === 'OK') {

            // for (let i = 0; i < campaignQueryResult.data.variantsList.length; i++) {

            //     // await runCrawler.runScript(campaignQueryResult.data.variantsList[i].name)
            //     // campaignQueryResult.data.variantsList[i]['variants'] = variants
            // }


            req.data =  campaignQueryResult.data.variantsList // sending the data to scrape in scrape middleware

            res.status(200).send({
                status: 'OK',
                message: campaignQueryResult.message,
                campaign: campaignQueryResult.data
            });

            next();

            return;
        }

        return res.status(400).send({
            status: campaignQueryResult.status,
            message: campaignQueryResult.message
        });
    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}


/**
 * @description - This route deletes the campaign and it's associated variants from the list.
 * @route - DELETE /api/campaigns/:campaignId
 * @param req - Request for the api call
 * @param res - Response for the api call
 * @param next 
 * @access private
 */
const handleDELETECampaign = async (req, res, next) => {
    try {
        const campaignQueryResult = await campaignInterface.deleteCampaign(req.params.campaignId)
        if (campaignQueryResult.status === 'OK') {
            return res.status(200).send({
                status: 'OK',
                message: campaignQueryResult.message,
                campaign: campaignQueryResult.data
            });
        }
        return res.status(400).send({
            status: campaignQueryResult.status,
            message: campaignQueryResult.message
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}


/**
 * @description - Updates a campaign 
 * @route - PUT /api/campaigns/:campaignId
 * @param req - Req.body will include the update values like ( campaign code , brand , variants in the campaign and the landing page url )
 *              If variants array exists in the body all the variants will be substitued. Another route is used to only update the variants. 
 * @param res - Response for the api call
 * @param next 
 */
const handlePUTCampaign = async (req, res, next) => {
    try {
        const campaignQueryResult = await campaignInterface.updateCampaign(req.params.campaignId, req.body)
        let variantQueryResult = {
            status: "OK",
            message: "",
            data: {}
        };

        if (req.body.variants) {
            let bool = await variantInterface.removeCampaigns(req.params.campaignId)
            if (bool) {
                const variantsList = req.body.variants
                variantsList.forEach(variant => {
                    variant['campaigns'] = req.params.campaignId
                })
                variantQueryResult = await variantInterface.addVariant(variantsList)
            }
            else {
                return res.status(400).send({
                    status: "ERROR",
                    message: "Variants could not be updated"
                });
            }
        }

        if (campaignQueryResult.status === 'OK' && variantQueryResult.status === "OK") {
            return res.status(201).send({
                status: 'OK',
                message: campaignQueryResult.message + variantQueryResult.message,
                campaign: campaignQueryResult.data,
                variants: variantQueryResult.data
            });
        }

        return res.status(400).send({
            status: campaignQueryResult.status,
            message: campaignQueryResult.message + variantQueryResult.message
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}

/**
 * @description - This route will add a list of variants to the list instead of substituting them. 
 * @route - /api/campaigns/:campaignId/variants
 * @param req - Request.body includes the variants list
 * @param res - Response for the api call
 * @param next 
 * @access private
 */
const handlePUTAddVariantsToCampaign = async (req, res, next) => {
    try {
        const variantsList = req.body.variants
        variantsList.forEach(variant => {
            variant['campaigns'] = req.params.campaignId
        })
        const variantQueryResult = await variantInterface.addVariant(variantsList)

        if (variantQueryResult.status === 'OK') {
            return res.status(201).send({
                status: 'OK',
                message: variantQueryResult.message,
                variants: variantQueryResult.data
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
 * @description - Returns the scraped data for the variants in a campaign
 * @route - GET /api/campaigns/:campaignId/variants
 * @param req 
 * @param res 
 * @param next 
 * @access public
 */
const handleGETCampaignScrapedData = async ( req, res, next )=>{
    try {
        const scrapeQueryResult = await scrapedDataInterface.getCampaignsScrapedData( req.params.campaignId )

        if( scrapeQueryResult.status === 'OK' ){
            console.log(scrapeQueryResult.data);

            return res.status(200).send({
                status: 'OK',
                message: scrapeQueryResult.message,
                scrapedData: scrapeQueryResult.data
            });
        }
        return res.status(400).send({
            status: scrapeQueryResult.status,
            message: scrapeQueryResult.message
        });
    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}


const handleGETAllCampaigns = async (req, res) => {
    try {
        let campaignsQueryResult = await campaignInterface.findCampaignsByQuery({}, {
            _id: 1
        });

        if (campaignsQueryResult.status !== 'OK') {
            return res.status(400).send({
                status: campaignsQueryResult.status,
                message: campaignsQueryResult.message
            });
        }

        let campaignIDs = campaignsQueryResult.data;

        console.log(campaignIDs);
        
        return res.status(200).send({
            status: 'OK',
            message: 'Successfully fetched all campaign ids',
            campaignIDs
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}


module.exports = {
    handlePOSTCampaign,
    handleGETCampaign,
    handleDELETECampaign,
    handlePUTCampaign,
    handlePUTAddVariantsToCampaign,
    handleGETCampaignScrapedData,
    handleGETAllCampaigns
}