const express = require("express");
const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();
const connectDB = require("./db/connect");
const voice = require("./models/voice");
const onlineMember = require("./models/onlineMembers");
const hedda =require('./controllers/hedda')
const {exec} =require('child_process')

const app = express();
const port = 3000;
app.use(express.json());
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
const meet = require("./models/meet");
start();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Post a meeting
app.post("/save-meeting",hedda, async (req, res) => {
  try {
    console.log(req.body);

    // Save the meeting to the database
    const pi = await meet.create({ title: req.body.title });
    if(!pi){
      res.status(500).json({msg:"internal server error"})
    }
    res.status(200).json({msg:"created",pi});
    console.log("our object:\n", pi);
     setInterval(() => {
      exec("curl http://127.0.1.1:3000/getUsersInVoice") 
    
     }, 1000);
    return res.status(201).json(newMeeting);
  } catch (error) {
    res.status();
  }
});

// GET online members
app.get("/online", (req, res) => {
  const result = {};
  res.send("Online Members: ");
  try {
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
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

app.get("/getUsersInVoice", (req, res) => {
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
        res.statusCode(500);
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
