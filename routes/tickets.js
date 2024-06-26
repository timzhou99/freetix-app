const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const QRCode = require('qrcode');

//Ticket Model
const Ticket = require('../models/Ticket');


//Event Model
const Event = require('../models/Event');

//View all the User's Tickets
router.get('/', ensureAuthenticated, (req, res) => {

Ticket.find({})
    .populate('event').exec((err, populatedTickets) => {

        let filteredTickets;

        if (req.query.search === '' || req.query.search === undefined){
            filteredTickets = populatedTickets.filter(ele => {
                return Event.exists({_id:ele._id}, (err, result) => result) && ele.event.eventEnd > Date.now();
            });
        } else {
            filteredTickets = populatedTickets.filter(ele => {
                return Event.exists({_id:ele._id}, (err, result) => result) && ele.event.eventEnd > Date.now() && ele.event.eventName.toLowerCase().includes(req.query.search.toLowerCase());
            });
        }

        filteredTickets.sort((a,b) => {
            return a.event.eventStart-b.event.eventStart;
        });

        res.render('tickets', { layout: 'layout_authenticated', tickets: populatedTickets});
    });
});


//View the Details of a Ticket
router.get('/:ticketID', ensureAuthenticated, (req, res) => {

    const found = req.user.tickets.find(ele => {
        return ele._id.toString() === req.params.ticketID;
    });

    if (found === undefined) {
        req.flash('error_msg', 'User does not have access to this ticket.');
        res.redirect('/tickets');
    } else {
        Ticket.findOne({_id:req.params.ticketID})
            .populate('event').exec((err, populatedTicket) => {
            QRCode.toDataURL(populatedTicket._id.toString(), function(err, url){
                res.render('ticket', { layout: 'layout_authenticated', ticket: populatedTicket, holder: req.user.name, qrcode:url});
            });

        });
    }

});

//Cancel a Ticket
router.post('/:ticketID/cancel', ensureAuthenticated, (req, res) => {

    const found = req.user.tickets.find(ele => {
        return ele._id.toString() === req.params.ticketID;
    });

    if (found === undefined){
        req.flash('error_msg', 'User does not have access to this ticket.');
        res.redirect('/tickets/' + req.params.ticketID);
    } else {
        Ticket.findOne({_id:req.params.ticketID})
            .populate('event').exec((err, populatedTicket) => {
                if (!populatedTicket.ticketStatus) {
                    req.flash('error_msg', 'Ticket has already been cancelled.');
                    res.redirect('/tickets/' + req.params.ticketID);
                } else {

                    Ticket.findOneAndUpdate({_id:req.params.ticketID}, {ticketStatus:false}, (err) =>{

                        if (err) {
                            throw err;
                        }

                        req.flash('success_msg', 'Successfully cancelled the ticket!');
                        res.redirect('/tickets/' + req.params.ticketID);

                    });
                }
            });
    }

});


module.exports = router;