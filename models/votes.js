const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema({
  yes: {
    type: Number,
  },

  no: {
    type: Number,
  },
});

module.exports = mongoose.model("votes", votesSchema);
