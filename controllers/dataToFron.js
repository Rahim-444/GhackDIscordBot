const voice = require("../models/voice");
const meet = require("../models/meet");
const onlineMember = require("../models/onlineMembers");
const Description = require("../models/description")

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

const postDescription = async (req, res) => {
  try {
    // Extract the description from the request body
    const { description } = req.body;

    // Validate the presence of the description
    if (!description) {
      return res.status(400).json({ status: 'failed', error: 'Description is required' });
    }

    // Create a new description record in the database
    const newDescription = await Description.create({ description });
    
    console.log(newDescription)
    // Respond with a success message
    res.status(201).json({ status: 'success', data: newDescription });
  } catch (error) {
    // Handle any errors that occur during the creation process
    console.error('Error creating description:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
};

module.exports={getAllMeets,getOnlineMembers,getVoices,postDescription}