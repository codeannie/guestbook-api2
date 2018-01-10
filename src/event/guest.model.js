const mongoose = require('mongoose');

const guestSchema = mongoose.Schema ({
  // userId: {type: String, required: true},
  eventId: {type: String, required: true},
  firstName: {type: String, trim: true, required: true},
  lastName: {type: String, trim: true, required: true},
  email: {type: String, trim: true, required: true},
  rsvpStatus: {type: Number,  default: 0}, 
  plusOne: {type: Number},
  notes: {type: String, trim: true},
  // plusOne: {
  //   needed: {type: Boolean, default: false},
  //   number: {type: Number }, //default: 0 ?
  //   name: [ 
  //     { 
  //     firstName: {type: String, trim: true}, //required? 
  //     lastName: {type: String, trim: true}, //required?
  //     }
  //   ]
  // },
  createdDate: {type: Date, required: true}, 
});

guestSchema.methods.toClient = function() {
  return {
    id: this._id,
    // userId: this.userId,
    eventId: this.eventId,
    name: `${this.firstName} ${this.lastName}`,
    email: this.email,
    rsvpStatus: this.rsvpStatus,
    plusOne: this.plusOne,
    // plusOne: {
    //   needed: this.needed,
    //   number: this.number, //default: 0 ?
    //   name: `${this.plusOne.firstName} ${this.plusOne.lastName}`
    //   },
    note: this.notes,
    createdDate: {type: Date, required: true}, 
    }
}

guestSchema.virtual('fulllName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = { Guest };

// export default Guest; 