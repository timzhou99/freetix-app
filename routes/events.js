const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Event Model
const Event = require('../models/Event');

//User Model
const User = require('../models/User');

//Ticket Model
const Ticket = require('../models/Ticket');

//View All Events (in the user's area)
router.get('/', ensureAuthenticated, (req, res) => {

    Event.find({eventState:req.user.userState}, function(err, events, count) {

        let filteredEvents;

        if (req.query.search === '' || req.query.search === undefined){
            filteredEvents = events.filter(ele => {
                return ele.eventEnd > Date.now();
            });
        } else {
            filteredEvents = events.filter(ele => {
                return ele.eventEnd > Date.now() && ele.eventName.toLowerCase().includes(req.query.search.toLowerCase());
            });
        }

        filteredEvents.sort((a,b) => {
            return a.eventStart-b.eventStart;
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
        ticketPrice
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

    Event.findOne({_id:req.params.eventID})
        .populate('tickets').exec((err, populatedEvent) => {
            User.findOne({_id:populatedEvent.eventManager}, function(err, user){
                res.render('event', {eventObj:populatedEvent, manager:user.name});
            });
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

    Event.findOne({_id:req.params.eventID})
        .populate('tickets').exec((err, populatedEvent) => {
            if (err) throw err;

            let currentQuantity = 1;

            populatedEvent.tickets.forEach(ele => {
                if (ele.ticketStatus)
                    currentQuantity++;
            });

            if (populatedEvent && currentQuantity <= populatedEvent.maxQuantity){

                const newTicket = new Ticket({
                    ticketHolder: req.user._id,
                    event: populatedEvent,
                    ticketType: 'General Admission',
                    ticketValue: populatedEvent.ticketPrice,
                    ticketStatus: true,
                });

                newTicket.save()
                    .then(ticket => {

                        User.findOneAndUpdate({_id:req.user._id}, {$push: {tickets:newTicket}}, function(err,success){
                            if (err) throw err;
                        });

                        Event.findOneAndUpdate({_id:populatedEvent._id}, {$push: {tickets:newTicket}}, function(err,success){
                            if (err) throw err;
                        });

                        req.flash('success_msg', 'Successfully purchased a ticket!');
                        res.redirect('/tickets');
                    })
                    .catch(err => console.log(err));

            } else if (currentQuantity > populatedEvent.maxQuantity){
                req.flash('error_msg', 'Event has hit max capacity.');
                res.redirect('/events');
            } else {
                req.flash('error_msg', 'Event does not exist.');
                res.redirect('/events');
            }

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