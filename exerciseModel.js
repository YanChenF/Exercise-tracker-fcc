const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const exerciseSchema = new Schema({
  userId: String,
  description: String,
  duration: Number,
  date: {
    type: Date,
    default: new Date
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);