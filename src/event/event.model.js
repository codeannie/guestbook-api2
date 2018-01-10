const mongoose = require('mongoose');
// import mongoose from 'mongoose';

const eventSchema = mongoose.Schema ({
  userId: {type: String}, //required: true
  name: {type: String, trim: true, required: true},
  description: {type: String, trim: true},
  startDateTime: {type: Date, required: true},
  endDateTime: {type: Date, required: true},
  locationName: {type: String, required: true},
  locationAddress: {type: String, required: true},
  locationLink: {type: String, trim: true},
  locationMap: {type: String, trim: true},
  eventStatus: {type: Number, required: true, default: 1}, 
  guestIds: {type: Array}, //array of ids that relate to guest documents 
  // guests: {type: Array}, // possibly handling it on front end? 
  createdDate: {type: Date, required: true}, 
});

eventSchema.methods.toClient = function() {
  return {
    id: this._id,
    userId: this.userId,
    name: this.name,
    description: this.description,
    startDateTime: this.startDateTime,
    endDateTime: this.endDateTime,
    locationName: this.locationName,
    locationAddress: this.locationAddress,
    locationLink: this.locationLink,
    locationMap: this.locationMap,
    eventStatus: this.eventStatus, 
    guestIds: this.guestIds, 
    createdDate: this.createdDate
    }
}

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };
// export default Event; 