/* eslint-disable no-undef */

// Dependecies
const express = require("express");
const { Client, IntentsBitField } = require("discord.js");
const { exec } = require("child_process");
const cors = require("cors");
const router = require("./routes/dataToRoute");
const { getAllMeets } = require("./controllers/dataToFron");

// .env
require("dotenv").config();

//models
const connectDB = require("./db/connect");
const voice = require("./models/voice");
const meet = require("./models/meet");
const votes = require("./models/votes");
const onlineMember = require("./models/onlineMembers");
const { time } = require("console");

// set up express
const app = express();

const port = 3001;
app.use(express.json());
app.use(cors());
//todo back to front:start
app.use("/api/v1", router);
//todo back to front:end

// Create a new client instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

// Starting the server
startServer();

// Starting the Bot
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Post a meeting
app.post("/save-meeting", async (req, res) => {
  try {
    // Create a new Instance of the meet and save it to the DB
    const newMeet = await meet.create({ title: req.body.title });
    if (!newMeet) {
      res.status(500).json({ msg: "internal server error" });
    }
    res.status(200).json({ msg: "created", newMeet });

    // Checking how many users are in the meet after few minutes
    setTimeout(() => {
      exec(process.env.DISCORD_COMMAND);
    }, 5000);

    return res.status(201).json(newMeet);
  } catch (error) {
    res.status();
  }
});

// GET online members in the server
app.get("/online", (req, res) => {
  const result = {};
  try {
    // get all the roles in the guild
    let roleCounts = new Map();
    client.guilds.cache.each((guild) => {
      guild.members
        .fetch()
        .then(async (members) => {
          members.each((member) => {
            if (member.presence && member.presence.status === "online") {
              member.roles.cache.each((role) => {
                if (roleCounts.has(role.name)) {
                  roleCounts.set(role.name, roleCounts.get(role.name) + 1);
                } else {
                  roleCounts.set(role.name, 1);
                }
              });
            }
          });

          // Store each role with how many members are online
          roleCounts.forEach((count, role) => {
            result[role] = count;
          });

          // Saving the number of active members in each role
          console.log(JSON.stringify(result, null, 2));
          await onlineMember.create(result);
        })
        .catch(console.error);
    });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

// get the active users in a voice chat
app.get("/getUsersInVoice", (req, res) => {
  let counter = 0;
  const result = {};

  res.send("getting users in voice ...");
  client.guilds.cache.each((guild) => {
    guild.members
      .fetch()
      .then(async (members) => {
        members.forEach((member) => {
          if (member.voice.channel) {
            counter++;
            result[member.voice.channel.name] = counter;
          }
        });

        // Saving the number of active members in a all the voice chats in the guild
        console.log(JSON.stringify(result, null, 2));
        await voice.create(result);
        console.log("Total users in voice: " + counter);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  });
});

// This function will start the server
async function startServer() {
  try {
    console.log("Connecting to the DB ...");
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to the DB successfully :)");

    // Start listening on the port 3000
    app.listen(port, () => {
      console.log(`app running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function that creates a poll to choose between two input times
app.post("/create-poll", async (req, res) => {
  try {
    console.log(req.body);
    let result = { "👍": 0, "👎": 0 };
    const { time1, time2 } = req.body;
    console.log("hello ", time1, time2);
    let channelId = process.env.CHANNEL_ID;
    const targetChannel = client.channels.cache.get(channelId);
    let question = `Which time works best for you? ${time1} or ${time2}?`;

    // Send the poll question
    const message = await targetChannel.send(question);

    // React with thumbs up and thumbs down emojis
    await message.react("👍");
    await message.react("👎");

    // Wait for reactions to be collected
    await sleep(5000);

    // Fetch the message to get the updated reaction counts
    const fetchedMessage = await targetChannel.messages.fetch(message.id);

    fetchedMessage.reactions.cache.forEach((reaction) => {
      // Update the counters based on the reaction
      result[reaction.emoji.name] = reaction.count;
    });

    console.log(result);

    // Create the new vote with the correct data
    const newVote = await votes.create({
      yes: result["👍"],
      no: result["👎"],
    });

    console.log(newVote);

    res.status(200).json({ msg: "created", newVote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
});

client.login(process.env.TOKEN);
