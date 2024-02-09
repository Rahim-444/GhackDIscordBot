const express = require("express");
const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();
const connectDB = require("./db/connect");
const voice=require('./models/voice')
const onlineMember=require('./models/onlineMembers')
const emptyObject = new Object();
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

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// GET online members
app.get("/online", (req, res) => {
  const result = {};
  res.send("Online Members: ");
  let roleCounts = new Map();

  client.guilds.cache.each((guild) => {
    guild.members
      .fetch()
      .then(async(members) => {
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
        const from_db = await onlineMember.create(result);//todo
      })
      .catch(console.error);
  });
});

app.get("/getUsersInVoice", (req, res) => {
  let counter = 0;
  const result = {};
  res.send("getting users in voice");
  client.guilds.cache.each((guild) => {
    guild.members
      .fetch()
      .then(async(members) => {
        members.forEach((member) => {
          if (member.voice.channel) {
            counter++;
            result[member.voice.channel.name] = counter;
          }
        });

        console.log(JSON.stringify(result, null, 2));
        const from_db = await voice.create(result);//todo rah l db
        console.log('from db:',from_db)
        console.log("Total users in voice: " + counter);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  });
});

app.get("/joiningDate", () => {
  let joinTime;
  client.on("voiceStateUpdate", (oldState, newState) => {
    let leaveTime;
    if (!oldState.channel && newState.channel) {
      console.log(
        `User ${newState.member.user.tag} has joined the voice channel ${newState.channel.name} at ${newState.channelId}`
      );
      joinTime = new Date().getTime();
      console.log("Day of the week (5 means friday) :");
      console.log(new Date().getDay());
    }
  });
});


async function start() {
  try {
    await connectDB(process.env.MONGO_URI); 
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();

client.login(
  // eslint-disable-next-line no-undef
  process.env.TOKEN
);
