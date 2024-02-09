const mongoose = require("mongoose");

const onlineMemberScheema = new mongoose.Schema({
  dev: {
    type: Number,
  },
  ["@everyone"]: {
    type: Number,
  },
  Ghack: {
    type: Number,
  },
  admin: {
    type: Number,
  },
});

module.exports = mongoose.model("onlineMember", onlineMemberScheema);
