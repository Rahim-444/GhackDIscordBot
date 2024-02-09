const Discord = require("discord.js");
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

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  let roleCounts = new Map();

  client.guilds.cache.each((guild) => {
    guild.members
      .fetch()
      .then((members) => {
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
          console.log(`${role}: ${count}`);
        });
      })
      .catch(console.error);
  });
});
let voiceTimes = new Map();
let joinTime;
client.on("voiceStateUpdate", (oldState, newState) => {
  let leaveTime;
  if (!oldState.channel && newState.channel) {
    console.log(
      `User ${newState.member.user.tag} has joined the voice channel ${newState.channel.name}`
    );
    //print current time stamp
    joinTime = new Date().getTime();
    //The `getDay()` method returns the day of the week for the specified date according to local time, where 0 represents Sunday, 1 represents Monday, and so on up to 6 for Saturday.
    //The `getDate()` method returns the day of the month for the specified date according to local time, as a number between 1 and 31.
    //So, for example, if a user joined on Monday, the 15th of a month, `getDay()` would return 1 and `getDate()` would return 15.
    console.log("Day of the week (5 means friday) :");
    console.log(new Date().getDay());
  }
  if (oldState.channel && !newState.channel) {
    console.log(
      `User ${oldState.member.user.tag} has left the voice channel ${oldState.channel.name}`
    );
    leaveTime = new Date().getTime();
    //time in seconds
    console.log("time spent in seconds : ");
    console.log((leaveTime - joinTime) / 1000);
    let guild = client.guilds.cache.first();
    guild.members
      .fetch(oldState.id)
      .then((member) => {
        console.log(`Roles for user ${member.user.tag}:`);
        member.roles.cache.each((role) => {
          console.log(role.name);
        });
      })
      .catch(console.error);
  }
});

client.login(
  "MTIwNTI1OTc1NDgxNDA1MDM1NA.GVCFsD.rguZMdhy6pIqxpCyjQeLGTmwaZ2PgZoYhhX6rE"
);
