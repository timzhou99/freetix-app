require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const flash = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const qrcode = require('qrcode');

const app = express();

const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Ticket = mongoose.model('Ticket');

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: false,
    saveUninitialized: false
};
app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

//authentication routes

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        new User({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userCity: req.body.city,
            userState: req.body.state
        }).save(function(err){

            if (err) {
                console.error(err);
                return;
            }

            res.redirect('/login');

        });

    } catch {
        res.redirect('/register');
    }

});

//routes

app.get('/events', (req, res) => {
    res.render('events');
});

app.get('/events/create', (req, res) => {
    res.render('create');
});

app.post('/events/create', (req, res) => {

    res.redirect('/events/hosting')
});

app.get('/events/hosting', (req, res) => {
    res.render('hosting');
});

app.get('/events/:eventID', (req, res) => {
    res.render('event');
});

app.get('/events/:eventID/manage', (req, res) => {
    res.render('manage');
});

app.get('/tickets', (req, res) => {
    res.render('tickets');
});

app.get('/tickets/:ticketID', (req, res) => {
    res.render('manage');
});

app.listen(3000);
console.log("server started on localhost:3000");