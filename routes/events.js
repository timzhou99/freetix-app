const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Event Model
const Event = require('../models/Event');

//View All Events (in the user's area)
router.get('/', ensureAuthenticated, (req, res) => {

    Event.find({eventState:req.user.userState}, function(err, events, count) {
        res.render('events', {events, state:req.user.userState});
    });

});

//View Events User is Hosting
router.get('/hosting', ensureAuthenticated, (req, res) => {

    Event.find({eventManager:req.user._id}, function(err, events, count) {
        res.render('hosting', {events});
    });

});

//Create an Event Page
router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create');
});

router.post('/create', ensureAuthenticated, (req, res) => {

    const { eventName, eventDescription, eventIMG, eventStart, eventEnd, eventAddress, eventCity, eventState, eventQuantity, ticketPrice} = req.body;

    const newEvent = new Event({
        eventManager: req.user._id,
        eventName,
        eventDescription,
        eventPicture: eventIMG,
        eventStart,
        eventEnd,
        eventAddress,
        eventCity,
        eventState,
        maxQuantity: eventQuantity,
        ticketPrice,
        currentQuantity: 0
    });

    newEvent.save()
        .then(event => {
            req.flash('success_msg', 'Successfully created an event!');
            res.redirect('/events/hosting');
        })
        .catch(err => console.log(err));

});

//View Event Details Page
router.get('/:eventID', ensureAuthenticated, (req, res) => {
    //res.render('event');
});

//Manage an Event Page
router.get('/:eventID/manage', ensureAuthenticated, (req, res) => {
    Event.findOne({_id:req.params.eventID}, function(err, eventObj) {
        res.render('manage', {eventObj});
    });
});

router.post('/:eventID/manage', ensureAuthenticated, (req, res) => {

    const { eventName, eventDescription, eventIMG, eventStart, eventEnd, eventAddress, eventCity, eventState, eventQuantity, ticketPrice} = req.body;

    const updatedEvent = {
        eventName,
        eventDescription,
        eventPicture: eventIMG,
        eventStart,
        eventEnd,
        eventAddress,
        eventCity,
        eventState,
        maxQuantity: eventQuantity,
        ticketPrice,
    };

    Event.updateOne({_id:req.params.eventID}, updatedEvent, function(err, response){
        if (err) throw err;

        req.flash('success_msg', 'Successfully modified the event!');
        res.redirect('/events/hosting');
    });

});


module.exports = router;