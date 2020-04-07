const mongoose = require('mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more events
// * they can also have 0 or more tickets
const User = new mongoose.Schema({

    email: {type:String, required: true},
    password: {type:String, required: true},

    firstName: {type:String, required: true},
    lastName: {type:String, required: true},

    events:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    tickets:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],

    userCity: {type: String, required: true},
    userState: {type: String, required: true}
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

    eventDate: {type: Date, required: true}

    //createdAt: {type: Date, required: true, default: Date.now}
}, {
    _id: true
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
    eventPicture: {type: String, required: true},
    eventActive: {type: Boolean, default: true, required: false},

    eventStart: {type: Date, required: true},
    eventEnd: {type: Date, required: true},

    eventAddress: {type: String, required: true},
    eventCity: {type: String, required: true},
    eventState: {type: String, required: true},

    maxQuantity: {type: Number, required: true},
    currentQuantity: {type: Number, required: true},
    tickets: [Ticket]
}, {
    _id: true
});

mongoose.model('User', User);
mongoose.model('Event', Event);
mongoose.model('Ticket', Ticket);

// is the environment variable, NODE_ENV, set to PRODUCTION?
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, '/config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // connection string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;

} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb+srv://freetix_app:6baJPEE8zmX3@test-cluster1-ucy6v.mongodb.net/test?retryWrites=true&w=majority';
}

mongoose.connect(dbconf, { useNewUrlParser : true, useUnifiedTopology : true});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below