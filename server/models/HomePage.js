const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const Homepage = mongoose.model('Homepage', homepageSchema);

module.exports = Homepage;