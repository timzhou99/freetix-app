const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//View All Events (in the user's area)
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('events');
})

//View Events User is Hosting
router.get('/hosting', ensureAuthenticated, (req, res) => {
    res.render('hosting');
});

//Create an Event Page
router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create');
});

//View Event Details Page
router.get('/:eventID', ensureAuthenticated, (req, res) => {
    //res.render('event');
});

//Manage an Event Page
router.get('/:eventID/manage', ensureAuthenticated, (req, res) => {
    //res.render('manage');
});

module.exports = router;