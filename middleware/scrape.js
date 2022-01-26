const runCrawler = require('../scripts/runCrawler')
const ScrapedData = require('../db/models/scrapedData').ScrapedData


const scrape = () => async (req, res, next) => {
    console.log("Here in scrape middleware");
    const sites = process.env.SITES.split(',')
    // console.log(req.data);
    let filePaths = []
    let variantIDs = []


    for (const item of req.data) {
        // If the data has already been scraped and present in the database for the campaign id, then skip scraping
        const data = await ScrapedData.find({
            name: {
                $regex: item.name,
                $options: "i"
            },
            campaigns: {
                $in: req.params.campaignId
            }
        })

        if (data.length != 0) {
            console.log("In here");
            continue;
        }

        // Will run for variants not present in the database. Might be variants that we didn't find in the site for the previous time
        await runCrawler.runScript(item.name)
        sites.forEach(site => {
            filePaths.push(`../data/${site}-${item.name.split(" ").join("_")}.json`)
            variantIDs.push(item._id);
        })
    }

    // console.log(filePaths);

    let variantsList = [];
    let i = -1;
    for (const file of filePaths) {
        try {
            i++;
            let variants = await require(file);
            let [temp] = [...variants]
            temp.variantID = variantIDs[i]
            variantsList.push(temp)
        } catch (e) {
            continue;
        }
    }


    // Only insert variants that have been scraped
    await ScrapedData.bulkWrite(variantsList.map(variant => ({
        updateOne: {
            filter: {
                name: variant.name,
                source: variant.source,
                url: variant.url
            },
            update: {
                finalPrice: variant.finalPrice,
                originalPrice: variant.originalPrice,
                variantID: variant.variantID,
                discount: variant.discount,
                createdAt: new Date(),
                $addToSet: { campaigns: req.params.campaignId }
            },
            upsert: true
        }
    })
    ));

    console.log("Done scraping");

}

module.exports = scrape 