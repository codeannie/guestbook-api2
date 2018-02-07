const { Guest } = require('./guest.model');
const { eventStatus, guestStatus } = require('./status.enum');

// GET ALL EXISTING GUESTS FROM EVENT
const findExistingGuests = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const userId = req.params.userId;  
  const eventId = req.params.eventId;
  Guest.find({ eventId: eventId })
    .then(guests => {
      return res.status(200).json({
        guests: guests.map(g => g.toClient())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'internal server error'
      });
    });
}
// ADD GUESTS 
const createGuest = (req, res) => {
  const eventId = req.params.eventId;
  const requiredFields = ['firstName', 'lastName', 'email'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Guest.create({
    eventId: req.params.eventId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    notes: req.body.notes,
    createdDate: new Date()
  })
    .then(guest => {
      res.status(201).json(guest.toClient());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: 'internal server error'
      });
    });
};

// MODIFY GUESTS 
const modifyGuest = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const guestId = req.params.guestId;
  const updated = {};
  const updateableFields = ['firstName', 'lastName', 'email', 'plusOne', 'notes']

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Guest.findByIdAndUpdate(guestId, { $set: updated }, { new: true })
    .then(updatedGuest => res.status(204).end())
    .catch(err =>
      res.status(500).json({
        message: `guest couldn't be updated`
      })
    );
};

// REMOVE GUESTS 
const removeGuest = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const guestId = req.params.guestId;
  Guest
    .findByIdAndRemove(guestId)
    .then(() => {
      console.log(`deleted guest: ${guestId}`);
      res.status(204).end()
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'internal server error' });
    });
};

// SEND EMAIL INVITE

// SEND ATTENDING GUEST REMINDER

// SEND TENTATIVE GUEST REMINDER 

// RSVP status - if still status of 0 or 3, 7 days prior, send reminder email
// RSVP status - if status of 1, send reminder email 2 days prior ot event 

module.exports = {
  findExistingGuests,
  createGuest,
  modifyGuest,
  removeGuest
}