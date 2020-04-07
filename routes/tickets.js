const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//View all the User's Tickets
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('tickets');
})

//View the Details of a Ticket
router.get('/:ticketID', ensureAuthenticated, (req, res) => {
    res.render('ticket');
});

module.exports = router;