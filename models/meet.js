const mongoose = require("mongoose");

const meetScheema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("meet", meetScheema);
