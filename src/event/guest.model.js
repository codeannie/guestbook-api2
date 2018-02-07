const mongoose = require('mongoose');

const guestSchema = mongoose.Schema ({
  eventId: {type: String, required: true},
  firstName: {type: String, trim: true, required: true},
  lastName: {type: String, trim: true, required: true},
  email: {type: String, trim: true, required: true},
  rsvpStatus: {type: Number,  default: 0},
  emailStatus: {type: Boolean, default: false},
  plusOne: {type: Number},
  notes: {type: String, trim: true},
  createdDate: {type: Date, required: true}, 
});

guestSchema.methods.toClient = function() {
  return {
    id: this._id,
    eventId: this.eventId,
    fullName: `${this.firstName} ${this.lastName}`,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    rsvpStatus: this.rsvpStatus,
    emailStatus: this.emailStatus,
    plusOne: this.plusOne,
    note: this.notes,
    createdDate: {type: Date, required: true}, 
    }
}

guestSchema.virtual('fulllName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = { Guest };