const mongoose = require("mongoose");

const voiceScheema = new mongoose.Schema({
  anotherone: {
    type: Number,
  },
},{timestamps:true});

module.exports = mongoose.model("vois", voiceScheema);
