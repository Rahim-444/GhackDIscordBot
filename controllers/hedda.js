const voice = require("../models/voice");
const { Client, IntentsBitField } = require("discord.js");

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
const hedda =(req, res) => {
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
}
 

module.exports = hedda;
