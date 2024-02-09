const mongoose = require("mongoose");

const meetScheema = new mongoose.Schema({
  title: {
    type: String,
  },
  // startTime: {
  //   type: Date,
  // },
},{timestamps:true});

module.exports = mongoose.model("meet", meetScheema);
