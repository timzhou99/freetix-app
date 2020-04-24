const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Event Model
const Event = require('../models/Event');

//User Model
const User = require('../models/User');

//View All Events (in the user's area)
router.get('/', ensureAuthenticated, (req, res) => {

    Event.find({eventState:req.user.userState}, function(err, events, count) {

        const filteredEvents = events.filter(ele => {
            return ele.eventEnd > Date.now();
        });

        res.render('events', {events:filteredEvents, state:req.user.userState});
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

            User.findOneAndUpdate({_id:req.user._id}, {$push: {events:newEvent}}, function(err,success){
                if (err) throw err;
            });

            req.flash('success_msg', 'Successfully created an event!');
            res.redirect('/events/hosting');
        })
        .catch(err => console.log(err));

});

//View Event Details Page
router.get('/:eventID', ensureAuthenticated, (req, res) => {

    Event.findOne({_id:req.params.eventID}, function(err, eventObj) {
        res.render('event', {eventObj, manager:req.user.name});
    });

});

//Manage an Event Page
router.get('/:eventID/manage', ensureAuthenticated, (req, res) => {

    const found = req.user.events.find(ele => {
        return ele.toString() === req.params.eventID;
    });

    if (found === undefined)
        res.render('manage');
    else {
        Event.findOne({_id:req.params.eventID}, function(err, eventObj) {
            res.render('manage', {eventObj});
        });
    }

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

router.post('/:eventID/purchase', ensureAuthenticated, (req, res) => {

    Event.findOne({_id:req.params.eventID}, function(err, eventObj) {
        if (err) throw err;

        if (!eventObj){

        } else {
            res.redirect('/tickets');
        }

        res.render('manage', {eventObj});
    });

});

router.get('/:eventID/delete', ensureAuthenticated, (req, res) => {

    const found = req.user.events.find(ele => {
        return ele.toString() === req.params.eventID;
    });

    if (found === undefined)
        res.render('manage');
    else {
        Event.deleteOne({_id:req.params.eventID}, function(err) {
            req.flash('success_msg', 'Successfully deleted the event!');
            res.redirect('/events/hosting')
        });
    }

});


module.exports = router;