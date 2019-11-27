const db = require('../handlers/database');
//=========================================
// @TODO other cleanup to remove calendars
// events, etc assciated with guild
//=========================================

module.exports = async (client, guild) => {
  db.get().collection('guilds').deleteOne({ _id:  guild.id }, function(err, res) {
    if (err) throw err;
    console.log("1 guild removed", guild.id);
  });      
}