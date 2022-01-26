const Session = require('../models/session').Session

/**
 * This method will insert a new Session into the database.
 * 
 * @param body This is a well formed Session object
 */
const insertSession = async (body) => {
    try {
        const session = await Session.create(body)

        if (session) {
            return {
                data: session,
                status: 'OK',
                message: 'A new session has been inserted into the database.'
            }
        }
        return {
            data: null,
            status: 'ERROR',
            message: 'New session could not be inserted into the database.'
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
 * This function takes an id as parameter and returns the Session document
 * that matches the provided id.
 *
 * @param id The _id of the session document to be queried
 * @returns Session The session whose _id matches the provided id
 */
const findSessionById = async (id) => {
    try {
        let session = await Session.findById(id);

        if (session) {
            return {
                data: session,
                status: 'OK',
                message: 'Session with provided id queried successfully'
            }
        }

        return {
            data: null,
            status: 'ERROR',
            message: 'Session with provided id does not exist'
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
 * This function takes a query object and an option object as parameters 
 * and returns the Session documents that match the query,
 * with attributes filtered using the option object.
 *
 * @param query The query parameters used to query the database for sessions
 * @param option The option filter that is used to filter out attributes
 * @returns [Session] An array of Sessions
 */
const findSessionsByQuery = async (query, option) => {
    try {
        let data = await Session.find(query, option);
        let message = data.length > 0 ? 'Sessions Found' : 'Session Not Found';
        return {
            data,
            message,
            status: 'OK'
        };
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'EXCEPTION'
        }
    }
};


/**
 * This function takes a query object and an option object as parameters 
 * and returns the first Session document that matches the query,
 * with attributes filtered using the option object.
 *
 * @param query The query parameters used to query the database for a session
 * @param option The option filter that is used to filter out attributes
 * @returns Session A Session
 */
const findSessionByQuery = async (query, option) => {
    try {
        let data = await Session.findOne(query, option);
        if (data) {
            return {
                data,
                message: 'Session Found',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'Session Not Found',
                status: 'ERROR'
            }
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'EXCEPTION'
        }
    }
};


/**
 * This function returns a list of all the Sessions available in the database
 *
 * @returns [Session] Array of all Sessions in the database
 */
const findAllSessions = async () => {
    try {
        let session = await Session.find();

        if (session) {
            return {
                data: session,
                count: session.length,
                status: 'OK',
                message: 'List of all sessions queried successfully'
            }
        }

        return {
            data: null,
            count: 0,
            status: 'ERROR',
            message: 'List of sessions could not be found'
        };
    } catch (e) {

        return {
            data: null,
            count: 0,
            status: 'EXCEPTION',
            message: e.message
        };
    }
}

/**
 * This method adds an event to a Session.
 * 
 * @param cookie The cookie used to uniquely identify a Session 
 * @param event The event that is to be added to the Session
 */
const addEventToSession = async (cookie, event) => {
    try {
        const sessionQueryResult = await findSessionByQuery({
            cookie
        });

        if (sessionQueryResult.status !== 'OK') {
            return {
                status: sessionQueryResult.status,
                message: sessionQueryResult.message
            };
        }

        const session = sessionQueryResult.data;

        session.events.push(event);

        await session.save();

        return {
            data: session,
            status: 'OK',
            message: 'Event added to session successfully'
        }

    } catch (e) {
        return {
            status: 'EXCEPTION',
            message: e.message
        }
    }
}


module.exports = {
    insertSession,
    findSessionById,
    findSessionByQuery,
    findSessionsByQuery,
    findAllSessions,
    addEventToSession
}