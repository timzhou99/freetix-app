const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

//User Model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => {
    res.render('login');
})

//Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

//Register Handle
router.post('/register', (req, res) => {
    const { email, password, name, city, state } = req.body;

    let errors = [];

    // Check Required Fields
    if (!email || !password || !name || !city || !state) {
        errors.push({ msg: "Please fill in all fields" });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            email,
            password,
            name,
            city,
            state
        });
    } else {
        // Validation Passed
        User.findOne({ email:email })
            .then(user => {
                if (user) {
                    // User Exists...
                    errors.push({ msg: 'Email is already registered.' });
                    res.render('login', {
                        errors,
                        email,
                    });
                } else {

                    const newUser = new User({
                       email,
                       password,
                       name,
                       userCity : city,
                       userState: state
                    });

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //Set password to hashed...
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered!');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }))

                }
            });
    }

});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/events',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have succesfully logged out.');
    res.redirect('/users/login');
});

module.exports = router;