const Campaign = require('../models/campaign').Campaign

/**
 * This function will insert a new campaign into the database
 * @param body - This is a well formed Campaign object
 */
const insertCampaign = async (body) => {
    try {
        const campaign = await Campaign.create(body)

        if (campaign) {
            return {
                data: campaign,
                status: 'OK',
                message: 'A new campaign has been inserted into the database. '
            }
        }
        return {
            data: null,
            status: 'ERROR',
            message: 'New campaign could not be inserted into the database. '
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
 * @description This method finds the campaign and the variants the campaign contains from the database
 * @param campaignId 
 */
const findCampaign = async (campaignId) => {
    try {
        const campaign = await Campaign.findById(campaignId).populate('variantsList')
        if (campaign) {
            return {
                data: campaign,
                status: 'OK',
                message: 'The campaign has been found from the database. '
            }
        }
        return {
            data: null,
            status: 'ERROR',
            message: 'The campaign could not be found from the database. '
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
 * @description - This method deletes a campaign. The variants get deleted through middleware. 
 * @param campaignId 
 */
const deleteCampaign = async (campaignId) => {
    try {
        const campaign = await Campaign.findById(campaignId)
        if (campaign) {

            await campaign.remove()

            return {
                data: {},
                status: 'OK',
                message: 'The campaign has been deleted from the database. '
            }
        }
        return {
            data: null,
            status: 'ERROR',
            message: 'The campaign could not be deleted from the database. '
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
 * @description - This method deletes a campaign. The variants get deleted through middleware. 
 * @param campaignId 
 */
const updateCampaign = async (campaignId, body) => {
    try {
        let campaign = await Campaign.findById(campaignId)
        if (campaign) {

            campaign = await Campaign.findByIdAndUpdate(campaignId, body, {
                new: true,
                runValidators: true
            })

            return {
                data: campaign,
                status: 'OK',
                message: 'The campaign has been updated into the database. '
            }
        }
        return {
            data: null,
            status: 'ERROR',
            message: 'The campaign could not be updated into the database. '
        };
    } catch (e) {
        return {
            data: null,
            status: 'EXCEPTION',
            message: e.message
        };
    }
}


const findCampaignsByQuery = async (query, option) => {
    try {
        let campaigns = await Campaign.find(query, option);

        if (campaigns) {
            return {
                data: campaigns,
                status: 'OK',
                message: 'Campaigns queried successfully'
            }
        }
        return {
            data: null,
            status: 'ERROR',
            message: 'Could not query campaigns'
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
    insertCampaign,
    findCampaign,
    deleteCampaign,
    updateCampaign,
    findCampaignsByQuery
}