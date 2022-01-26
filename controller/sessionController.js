const sessionInterface = require('../db/interfaces/sessionInterface')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @description This method either creates a new session or adds event to the session
 * @route - POST /api/sessions
 * @param req - Req.body will include ( cookie 
                                        event: {
                                            name,
                                            timestamp,
                                            scrapedData
                                        }
                                        campaignId
                                        source
                                        device
                                        location (based on whether the user consents to location information usage)
                                    )
 * @param res - Response for the api call
 * @param next 
 */
const handlePOSTSession = async (req, res, next) => {
    try {
        // console.log(req.body);
        let sessionQueryResult = {}
        let event = req.body.event;
        if (event.name === 'event_home_init') {
            // console.log("A new session has started.");
            let session = {
                events: [event],
                campaign: req.body.campaignId,
                source: req.body.source,
                device: req.body.device
            };

            if (req.body.location !== null) session.location = req.body.location;

            sessionQueryResult = await sessionInterface.insertSession(session);

            if (sessionQueryResult.status === 'OK') {
                let insertedSession = sessionQueryResult.data;
                
                console.log(insertedSession);

                let access = 'auth';
                let cookie = await jwt.sign({
                    _id: insertedSession._id.toString(),
                    access
                }, 'weirdestshitinthewholewideworldofweirdshits').toString();
                
                insertedSession.cookie = cookie;

                await insertedSession.save();

                return res.status(201).send({
                    status: 'OK',
                    message: sessionQueryResult.message,
                    cookie
                });
            }
        }
        else {
            console.log("A new event will be added to an existing session");
            let cookie = req.header('x-auth');
            sessionQueryResult = await sessionInterface.addEventToSession(cookie, event);

            if (sessionQueryResult.status === 'OK') {
                return res.status(201).send({
                    status: 'OK',
                    message: sessionQueryResult.message
                });
            }
        }
        
        console.log(sessionQueryResult.message);

        return res.status(400).send({
            status: sessionQueryResult.status,
            message: sessionQueryResult.message
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}

/**
 * @description This method gets all the session data from the collection
 * @route - GET /api/sessions
 * @param req Request for the api call
 * @param res Response for the api call
 * @param next 
 */
const handleGETSession = async (req, res, next) => {
    try {
        let sessionQueryResult;
        if( req.query.campaign ){
            sessionQueryResult = await sessionInterface.findSessionByQuery({ campaign : req.query.campaign })
        }
        else{
            sessionQueryResult = await sessionInterface.findAllSessions()
        }

        if (sessionQueryResult.status === 'OK') {
            return res.status(200).send({
                status: 'OK',
                message: sessionQueryResult.message,
                sessions: sessionQueryResult.data
            });
        }
        return res.status(400).send({
            status: sessionQueryResult.status,
            message: sessionQueryResult.message
        });

    } catch (e) {
        return res.status(500).send({
            status: 'EXCEPTION',
            message: e.message
        });
    }
}

module.exports = {
    handlePOSTSession,
    handleGETSession
}