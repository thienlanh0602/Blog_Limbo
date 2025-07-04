const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
  type: {
    type: String,
    require: false,
  },
  title: {
    type: String,
    required: false,
  },
  title_2: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const Homepage = mongoose.model('Homepage', homepageSchema);

module.exports = Homepage;