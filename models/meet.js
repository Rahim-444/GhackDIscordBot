const mongoose = require("mongoose");

const meetScheema = new mongoose.Schema({
  title: {
    type: String,
  },
  StartTime: {
    type: Date,
  },
});

module.exports = mongoose.model("meet", meetScheema);
