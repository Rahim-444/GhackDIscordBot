const voice = require("../models/voice");
const meet = require("../models/meet");
const onlineMember = require("../models/onlineMembers");

const getAllMeets = async (req, res) => {
  const meets = await meet.find({}).sort("createdAt");
  res.status(201).json({ meets, count: meets.length });
};
const getOnlineMembers = async (req, res) => {
  const member = await onlineMember.find({}).sort("createdAt");
  res.status(201).json({ member, count: member.length });
};
const getVoices = async (req, res) => {
  const v = await voice.find({}).sort("createdAt");
  res.status(201).json({ v, count: v.length });
};

module.exports={getAllMeets,getOnlineMembers,getVoices}