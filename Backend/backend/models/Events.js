const mongoose = require('mongoose');

const  EventsSchema = new mongoose.Schema({
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appowner :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  Date: {
    type: Date,
    default: Date.now 
  }
});

const Events = mongoose.model('Events', EventsSchema);

module.exports = Events;