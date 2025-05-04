// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  interests: {
    type: [String],
    default: [],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: 'Please select at least one interest.'
    }
  },
  isSubscribed: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
