const mongoose = require('mongoose');

// a ticket
// * each ticket is tied to an eventID and a User
// * a ticket could have a type, "General," "VIP," etc...
// * a ticket has a status, "Paid," "Cancelled"
const TicketSchema = new mongoose.Schema({

    ticketHolder: {type: String, required: true},
    eventID: {type: String, required: true},

    ticketType: {type: String, required: true},
    ticketValue: {type: Number, required: true},
    ticketStatus: {type: String, required: true},

    eventDate: {type: Date, required: true}

}, {
    _id: true
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
