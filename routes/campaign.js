let express = require('express');
let router = express.Router();

const campaignController = require('../controller/campaignController');
const scrape = require('../middleware/scrape')

router.route('/')
        .post(campaignController.handlePOSTCampaign)

router.route('/all')
        .get(campaignController.handleGETAllCampaigns)

router.route('/:campaignId')
        .get(campaignController.handleGETCampaign, scrape())
        .delete(campaignController.handleDELETECampaign)
        .put(campaignController.handlePUTCampaign)

router.route('/:campaignId/variants')
        .put(campaignController.handlePUTAddVariantsToCampaign)

router.route('/:campaignId/scrapeddata')
        .get(campaignController.handleGETCampaignScrapedData)

module.exports = router