let express = require('express');
let router = express.Router();


const sessionController = require('../controller/sessionController');

router.route('/')
        .get( sessionController.handleGETSession )
        .post( sessionController.handlePOSTSession )



module.exports = router