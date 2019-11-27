const db = require('../handlers/database');

module.exports = async (client, guild) => {
  let d = new Date();
  
  const guildData = {
    "_id": guild.id,
    "name": guild.name,
    "region": guild.region,
    "ownerName": guild.owner.displayName,
    "ownerId": guild.ownerID,
    "timeAdded": d,
    "settings":{
        "allowedRoles":[],
        "prefix":'!'
    },
  };
  db.get().collection('guilds').insertOne(guildData, function(err, res) {
    if (err) throw err;
    console.log("1 guild added", guildData);
  });
}