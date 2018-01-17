const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./guest.controller');
const passport = require('passport');
const router = express.Router();

router.use(bodyParser.json());

// GET ALL GUESTS FROM EVENT
router.get(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  controller.findExistingGuests
);

// ADD NEW GUEST
router.post(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  controller.createGuest
)

// MODIFY GUEST
router.put(
  '/:eventId/:guestId',
  passport.authenticate('jwt', { session: false }),
  controller.modifyGuest
)

// REMOVE GUEST
router.delete(
  '/:eventId/:guestId',
  passport.authenticate('jwt', { session: false }),
  controller.removeGuest
)

module.exports = router;