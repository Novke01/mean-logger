'use strict';

var Application = require('./../../application/application.model');
var mongoose = require('mongoose');

var eventService = {
    createEvent: createEvent,
    getEvent:    getEvent,
    getEvents:   getEvents
};

var pageSize = 20;

/**
 * Creates new event and saves it to DB.
 * 
 * @param {Object} event        - New event that will be created.
 * @param {Function} onSuccess - Callback function that is called on successful operation.
 * @param {Function} onError   - Callback function that is called on error.
 */
function createEvent (applicationKey, event, onSuccess, onError) {

    Application.findOneAndUpdate({
        key: applicationKey
    },
    {
        $push: {
            events: { 
                $each: [event],
                $position: 0
            }
        }
    },
    {
        new: true
    })
    .slice('events', 1)
    .select('name users.email events')
    .exec(onEventCreated);

    function onEventCreated (error, application) {
        if (error) return onError(error);
        if (!application) return onError({
            message: 'Couldn\'t register new event.',
            code:    400
        });
        onSuccess(application);
    }

}

/**
 * Returns event object.
 * 
 * @param {String} eventId       - Event's id.
 * @param {String} userId        - User's id.
 * @param {Function} onSuccess   - Callback function that will be called on successful operation.
 * @param {Function} onError     - Callback function that will be called on error.
 */
function getEvent (eventId, userId, onSuccess, onError) {

    Application.findOne({
        'events._id': eventId,
        'users.userId': userId
    })
    .exec(onGetApplication);

    function onGetApplication (error, application) {
        if (error) return onError(error);
        if (!application) return onError({
            message: 'Application not found.',
            code:    404
        });
        var event = application.events.id(eventId);
        if (event === null) return onError(error);
        onSuccess(event);
    }

}

/**
 * Returns a page of events for application.
 * 
 * @param {String} applicationId - Application id.
 * @param {Number} pageNo        - Page number of events.
 * @param {String} userId        - User's id.
 * @param {Function} onSuccess   - Callback function that is called on operation success.
 * @param {Function} onError     - Callback function that is called on error.
 */
function getEvents(applicationId, pageNo, userId, onSuccess, onError) {
    
    Application.findOne({
        '_id': applicationId,
        'users.userId': userId
    })
    .select('events')
    .slice('events', [pageNo * pageSize, pageSize])
    .exec(onGetApplication);

    function onGetApplication (error, application) {
        if (error) return onError(error);
        if (!application) return onError({
            message: 'Application not found.',
            code:    404
        });
        Application.aggregate({
            $match: {
                _id: mongoose.Types.ObjectId(applicationId)
            }
        },
        {
            $unwind: '$events'
        },
        {
            $group: {
                _id: '$_id',
                total: {$sum: 1}
            }
        })
        .exec(function (error, result) {
            onEventsCount(error, result, application.events);
        });
        
        
    }

    function onEventsCount (error, result, events) {
        if (error) return onError(error);
        onSuccess({
            page: events,
            total: (result.length > 0) ? result[0].total : 0,
            pageSize: pageSize
        });
    }

}

module.exports = eventService;