const express = require("express");
const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();
const connectDB = require("./db/connect");
const voice = require("./models/voice");
const onlineMember = require("./models/onlineMembers");
const Meet = require("./models/meet");

const app = express();
const port = 3000;

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

start();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Post a meeting
app.post("/save-meeting", async (req) => {
  const { title, startTime } = req.body;

  const newMeeting = new Meet({
    title,
    StartTime: new Date(startTime),
  });

  // Save the meeting to the database
  await newMeeting.save();
});

// GET online members
app.get("/online", (res) => {
  const result = {};
  res.send("Online Members: ");
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

        console.log("Online members by role:");
        roleCounts.forEach((count, role) => {
          result[role] = count;
        });

        console.log(JSON.stringify(result, null, 2));
        await onlineMember.create(result);
      })
      .catch(console.error);
  });
});

app.get("/getUsersInVoice", (res) => {
  let counter = 0;
  const result = {};
  res.send("getting users in voice");
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

        console.log(JSON.stringify(result, null, 2));

        await voice.create(result);
        console.log("Total users in voice: " + counter);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  });
});

async function start() {
  try {
    // eslint-disable-next-line no-undef
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`app running on http://127.0.1.1:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

client.login(
  // eslint-disable-next-line no-undef
  process.env.TOKEN
);
