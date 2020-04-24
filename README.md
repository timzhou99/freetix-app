# FreeTix

## Overview

Tired of paying fees when buying tickets for your favorite concert or event? Look no further because FreeTix is here for you.

FreeTix is a commission free event management and ticketing web app that is designed for both event planners and event go-ers that allow users to plan events, sell and buy tickets, as well as search for events in their cities. Each user (through registration and login authentication) is able to manage their own events and view all the tickets that they have purchased.


## Data Model

The application will store Users, Events, and Tickets

* users can manage multiple events (each event tagged to the user by a reference)
* each event can have multiple tickets (each ticket tagged to an event by a reference)
* users can have multiple tickets (each ticket is tagged to a user by a reference)

An Example User:

```javascript
{
  email: "tim@gmail.com",
  password: // a password hash,
  
  name: "Timothy Zhou",
  
  events: // an array of references to Event documents
  tickets: //an array of references to Ticket documents
  
  userCity: "New York",
  userState: "New York"
  
  _id: //MongoDB generated ID
}
```

An Example Event with a List of Ticket IDs:

```javascript
{
  eventManager: // a reference to a User object
  
  eventName: "Travis Scott Concert",
  eventDescription: "The best event of the month!",
  eventPicture: "link.to.image.com",
  eventActive: true,
  
  eventStart: //datetime the event starts
  eventEnd: //datetime the event ends
  
  eventAddress: "40 W 4th Street",
  eventCity: "New York",
  eventState: "New York",

  maxQuantity: 500,
  currentQuantity: 346,
  tickets: [
    { ticketID: "UNIQUE KEY", ticketType: "General Admission", ticketValue: 150.00},
    { ticketID: "UNIQUE KEY", ticketType: "VIP Admission", ticketValue: 350.00},
  ],
  
  _id: //MongoDB generated ID
}
```

An Example Ticket:

```javascript
{
  ticketHolder: // a reference to a User object
  eventID: "key that references the ticket to an Event",
  
  ticketType: "General Admission",
  ticketValue: 150.00,
  ticketStatus: "Cancelled",

  _id: //MongoDB generated ID
}
```

## [Link to Commented First Draft Schema](db.js) 

## Wireframes

/events/create - page for creating a new event

![events_create](documentation/events-create.PNG)

/events/eventID/manage - page for managing an existing event

![events eventID_manage](documentation/events-manage.PNG)

/events/hosting - page to view and manage all events the user is hosting

![events_hosting](documentation/events-hosting.PNG)

/events/eventID - page for viewing the details of an event and option to purchase a ticket

![events_eventID](documentation/events-eventID.PNG)

/events - page for showing all events and the ability to filter them

![events](documentation/events.PNG)

/tickets/ticketID - page for viewing the details of an existing ticket and option to cancel it

![tickets_ticketID](documentation/tickets-ticketID.PNG)

/tickets - page for showing all tickets

![tickets](documentation/tickets.PNG)

## Site Map

![sitemap](documentation/sitemap.PNG)

## User Stories

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new event
4. as a user, I can modify an existing event
5. as a user, I can view all of the events I've created in a single list
6. as a user, I can view all of the tickets I've purchased in a single list
7. as a user, I can view all of the events in my area or in the United States
8. as a user, I can purchase a ticket
9. as a user, I can cancel my ticket
10. as a user, I can view my ticket

## Research Topics

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * It's a middleware for Node.js so it is very flexible to be used in an Express-based web app.
* (5 points) Automated functional testing for all of my routes 
    * Will be using Selenium and Python to run all my tests 
    * Each test run will register and login a user; create, modify, and delete an event; and purchase and cancel a ticket.
* (2 points) Implement qrcode module for server side functions
    * will generate a QR code image for every ticket created (associated with the ticket ID)
    * this will be helpful in future releases of the web app to "check people into an event"

12 points total out of 8 required points

## [Link to Initial Main Project File](app.js) 

## Annotations / References Used

1. [passport.js authentication docs](http://passportjs.org/docs) - (https://www.youtube.com/watch?v=6FOq4cUdH8k)
2. [tutorial on qrcode](http://thecodebarbarian.com/creating-qr-codes-with-node-js.html) - (add link to source code that was based on this)
3. [google maps docs](https://developers.google.com/maps/documentation/embed) - (add link to source code that was based on this)

