const mongoose = require("mongoose");

const voiceScheema = new mongoose.Schema({
  anotherone: {
    type: Number,
  },
});

module.exports = mongoose.model("vois", voiceScheema);
