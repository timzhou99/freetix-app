const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const QRCode = require('qrcode');

//Event Model
const Event = require('../models/Event');

//User Model
const User = require('../models/User');

//Ticket Model
const Ticket = require('../models/Ticket');

//View all the User's Tickets
router.get('/', ensureAuthenticated, (req, res) => {

    User.findOne({_id:req.user._id})
        .populate('tickets').exec((err, results) => {
            Ticket.find({})
                .populate('event').exec((err, populatedTickets) => {

                    let filteredTickets;

                    if (req.query.search === '' || req.query.search === undefined){
                        filteredTickets = populatedTickets.filter(ele => {
                            return ele.event.eventEnd > Date.now();
                        });
                    } else {
                        filteredTickets = populatedTickets.filter(ele => {
                            return ele.event.eventEnd > Date.now() && ele.event.eventName.toLowerCase().includes(req.query.search.toLowerCase());
                        });
                    }

                    filteredTickets.sort((a,b) => {
                        return a.event.eventStart-b.event.eventStart;
                    });

                    res.render('tickets', {tickets: filteredTickets});
            });
        });

});

//View the Details of a Ticket
router.get('/:ticketID', ensureAuthenticated, (req, res) => {

    Ticket.findOne({_id:req.params.ticketID})
        .populate('event').exec((err, populatedTicket) => {
            QRCode.toDataURL(populatedTicket._id.toString(), function(err, url){
                console.log(url);
                res.render('ticket', {ticket: populatedTicket, holder: req.user.name, qrcode:url});
            });

        });

});

//Cancel a Ticket
router.post('/:ticketID/cancel', ensureAuthenticated, (req, res) => {
    res.render('ticket');
});


module.exports = router;