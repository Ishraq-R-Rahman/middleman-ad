const ScrapedData = require('../models/scrapedData').ScrapedData

const getCampaignsScrapedData = async ( campaignId )=>{
    try{
        const data = await ScrapedData.find({
            campaigns : { $in : [campaignId] }
        })

        if( data ){
            return {
                data,
                status: 'OK',
                message: 'Scraped data for the campaign have been quieried successfully.'
            }
        } 

        return {
            data: null,
            status: 'ERROR',
            message: 'Scraped data for the provided id do not exist'
        };
    }catch(e){
        return {
            data: null,
            status: 'EXCEPTION',
            message: e.message
        };
    }
}


module.exports = {
    getCampaignsScrapedData
}