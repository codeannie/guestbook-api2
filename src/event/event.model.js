const mongoose = require('mongoose');

const eventSchema = mongoose.Schema ({
  userId: {type: String}, 
  eventName: {type: String, trim: true, required: true},
  description: {type: String, trim: true},
  date: {type: Date, required: true}, 
  startTime: {type: Date}, 
  endTime: {type: Date}, 
  locationName: {type: String, required: true},
  locationAddress: {type: String, required: true}, 
  locationLink: {type: String, trim: true},
  locationMap: {type: String, trim: true},
  eventStatus: {type: Number, required: true, default: 1}, 
  //array of ids that relate to guest documents 
  guestIds: {type: Array}, 
  createdDate: {type: Date, required: true}, 
});

eventSchema.methods.toClient = function() {
  return {
    id: this._id,
    userId: this.userId,
    eventName: this.eventName,
    description: this.description,
    date: this.date,
    startTime: this.startTime,
    endTime: this.endTime,
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
