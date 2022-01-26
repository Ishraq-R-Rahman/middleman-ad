let express = require('express');
let router = express.Router();

const scrape = require('../middleware/scrape')


// TODO: Write product GET route
const variantController = require('../controller/variantController')

router.get('/', variantController.handleGETAllVariants)
// router.post('/product' , variantController.handlePOSTCreateVariant )
// router.get('/product/:id' , variantController.handleGETVariant )
router.route('/:variantId')
        .put( variantController.handlePUTUpdateVariant )

module.exports = router;
