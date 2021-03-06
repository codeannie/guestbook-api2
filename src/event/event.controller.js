const { isBefore, startOfToday } = require("date-fns");
const { Event } = require("./event.model");
const { eventStatus } = require("./status.enum");

// GET ALL EXISTING EVENTS
const findExistingEvents = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json("Not authorized");
  }
  // find by user id
  const userId = req.params.userId;
  // find and sort date ascending 
  Event.find({ userId: userId }, null, {sort: {date: 1}})
    .then(events => {
      return res.status(200).json({
        events: events.map(e => e.toClient())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "internal server error"
      });
    });
};

// GET ALL ACTIVE EVENTS
const findActiveEvents = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json("Not authorized");
  }
  // find by user id
  const userId = req.params.userId;

  Event.find({ userId: userId, status: 1 })
    .then(events => {
      return res.status(200).json({
        events: events.map(e => e.toClient())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "internal server error"
      });
    });
};

// GET ALL PAST EVENTS
const findPastEvents = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json("Not authorized");
  }
  // find by user id
  const userId = req.params.userId;

  Event.find({
    // find events older than current date
    userId: userId,
    date: { $lt: new Date().toISOString() }
    })
    .then(pastEvents => {
      return res.json({
        events: pastEvents.map(event => event.toClient())
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "internal server error"
      });
    });
};

// GET ALL ARCHIVED EVENTS
const findArchivedEvents = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json("Not authorized");
  }
  // find by user id
  const userId = req.params.userId;

  Event.find({ userId: userId, status: 3 })
    .then(events => {
      return res.status(200).json({
        events: events.map(e => e.toClient())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "internal server error"
      });
    });
};

// CREATE EVENT
const createNewEvent = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json("Not authorized");
  }

  const requiredFields = ["eventName", "date"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];

    // how to send this error to client?
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Event.create({
    userId: req.params.userId,
    eventName: req.body.eventName,
    description: req.body.description,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    locationName: req.body.locationName,
    locationAddress: req.body.locationAddress,
    locationLink: req.body.locationLink,
    locationMap: req.body.locationMap,
    createdDate: new Date(),
    })
    .then(event => {
      res.status(201).json(event.toClient());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: "internal server error"
      });
    });
};

// MODIFY EVENT DETAILS (name, date, time, location, etc)
const modifyEventDetails = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json("Not authorized");
  }

  const eventId = req.params.eventId;
  const updated = {};
  const updateableFields = [
    "eventName",
    "description",
    "date",
    "startTime",
    "endTime",
    "locationName",
    "locationAddress",
    "locationLink",
    "locationMap"
  ];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Event.findByIdAndUpdate(eventId, { $set: updated }, { new: true })
    .then(updatedEvent => {
      res.status(204)
      .json(updatedEvent.toClient())
      .end()
    })
    .catch(err =>
      res.status(500).json({
        message: `event couldn't be updated`
      })
    );
};

module.exports = {
  createNewEvent,
  findExistingEvents,
  findActiveEvents,
  findPastEvents,
  findArchivedEvents,
  modifyEventDetails
};
