const mongoose = require('mongoose');

const EventSchema = require('./Event').schema;
const TicketSchema = require('./Ticket').schema;

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more events
// * they can also have 0 or more tickets
const UserSchema = new mongoose.Schema({

    email: {type:String, required: true},
    password: {type:String, required: true},

    name: {type:String, required: true},

    events:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],

    userCity: {type: String, required: true},
    userState: {type: String, required: true}

}, {
    _id: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
