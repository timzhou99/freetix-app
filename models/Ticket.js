const mongoose = require('mongoose');

// a ticket
// * each ticket is tied to an eventID and a User
// * a ticket could have a type, "General," "VIP," etc...
// * a ticket has a status, "Paid," "Cancelled"
const TicketSchema = new mongoose.Schema({

    ticketHolder: {type: String, required: true},
    event: {type: mongoose.Schema.Types.ObjectID, ref: 'Event', required: true},

    ticketType: {type: String, required: true},
    ticketStatus: {type: Boolean, required: true},

    purchaseDate: {type: Date, default: Date.now, required: true}

}, {
    _id: true
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
