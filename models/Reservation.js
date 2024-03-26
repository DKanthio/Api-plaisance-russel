const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  catwayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catway',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  boatName: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
