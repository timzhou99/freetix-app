const mongoose = require('mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more events
// * they can also have 0 or more tickets
const User = new mongoose.Schema({
    // username provided by authentication plugin
    // password hash provided by authentication plugin
    events:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    tickets:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
});

// an event
// * includes properties that pertain to the event
// * a event is associated with a User
// * a event has a list of Tickets
// * when an event has passed its date and end time, it is Not Active
const Event = new mongoose.Schema({
    eventManager: {type: mongoose.Schema.Types.ObjectId, ref:'User'},

    eventName: {type: String, required: true},
    eventDescription: {type: String, required: true},
    eventActive: {type: Boolean, default: true, required: false},

    eventDate: {type: Date, required: true},
    eventTimeStart: {type: Date, required: true},
    eventTimeEnd: {type: Date, required: true},

    eventAddress: {type: String, required: true},
    eventCity: {type: String, required: true},
    eventState: {type: String, required: true},

    maxQuantity: {type: Number, required: true},
    currentQuantity: {type: Number, required: true},
    tickets: [Ticket]
}, {
    _id: true
});

// a ticket
// * each ticket is tied to an eventID and a User
// * a ticket could have a type, "General," "VIP," etc...
// * a ticket has a status, "Paid," "Cancelled"

const Ticket = new mongoose.Schema({
    ticketHolder: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    eventID: {type: String, required: true},

    ticketType: {type: String, required: true},
    ticketValue: {type: Number, required: true},

    ticketStatus: {type: String, required: true},

    createdAt: {type: Date, required: true}
}, {
    _id: true
});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below