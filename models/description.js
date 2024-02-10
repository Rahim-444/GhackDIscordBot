const mongoose = require('mongoose');

// Define the schema for the Description model
const descriptionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Description model using the schema
const Description = mongoose.model('Description', descriptionSchema);

// Export the Description model
module.exports = Description;
