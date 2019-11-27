const db = require('../handlers/database');
const guildCreate = require('./guildCreate.js');

module.exports = (client) => {
  //Create databases for any missing guilds
  const availableGuilds = Array.from(client.guilds.keys());

  db.get().collection('guilds').find({}, { _id: 1}).map(x=>x._id).toArray(function(err, result) {
    if (err) throw err;
    const knownGuilds = result;     
    const unknownGuilds = availableGuilds.filter(x => !knownGuilds.includes(x));

    unknownGuilds.forEach((guildId) => {
      console.log("unknown guild found; creating", guildId);
      const guild = client.guilds.find(guild=>guild.id == guildId);
      guildCreate(client, guild);
    });
  })
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setStatus("online");
  };