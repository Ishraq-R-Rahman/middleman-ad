const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//Load env
dotenv.config({path: './config/config.env'})

//Load Models 
const Variant = require('./db/models/variant').Variant
const Campaign = require('./db/models/campaign').Campaign


//Connect DB
mongoose.connect( process.env.MONGODB_URI , {
    useUnifiedTopology: true,
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false
})


let campaignsList = require('./chaldal_campaigns.json')
let variantList = require('./chaldal_variantList.json')

// campaignsList = campaignsList.filter( (campaignsList, index , self )=>
//     index === self.findIndex( (t) => ( t.name === campaignsList.name && t.brand === campaignsList.brand ) )
// )


//Import data to database
const importData = async () =>{
    try {
        
        await Campaign.create( campaignsList )
        await Variant.create( variantList )

        console.log('Data Imported...'.green.inverse);
        process.exit()
    }
    catch(err ){
        console.error(err)
    }
}

//Delete data
const deleteData = async()=>{
    try {

        const collections = await mongoose.connection.db.collections()

        for (let collection of collections) {
            await collection.deleteMany()
        }

        console.log('Data Deleted...'.red.inverse);
        process.exit()
    }
    catch(err ){
        console.error(err)
    }
}


if( process.argv[2] === '-i' ){
    importData();

}else if( process.argv[2] === '-d'){
    const db = mongoose.connection

    db.once('open', () =>{
        deleteData();
    })
    
}