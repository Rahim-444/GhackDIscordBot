const mongoose = require("mongoose");

const usersInVoiceSchema = new mongoose.Schema(
  {
    voiceChat: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("usersInVoice", usersInVoiceSchema);
