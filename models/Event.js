const mongoose = require('mongoose');
const TicketSchema = require('./Ticket').schema;

// an event
// * includes properties that pertain to the event
// * a event is associated with a User
// * a event has a list of Tickets
// * when an event has passed its date and end time, it is Not Active
const EventSchema = new mongoose.Schema({
    eventManager: {type: String, required: true},

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
    ticketPrice: {type: Number, required: true},
    currentQuantity: {type: Number, required: true},
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
}, {
    _id: true
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
