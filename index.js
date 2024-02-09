const Discord = require("discord.js");
const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
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

client.login(
  "MTIwNTI1OTc1NDgxNDA1MDM1NA.GVCFsD.rguZMdhy6pIqxpCyjQeLGTmwaZ2PgZoYhhX6rE"
);
