
const db= require('../handlers/database');

exports.run = async ( client, message, args, settings ) => {
  console.log("ARGS",args)
  switch(args[0].toLowerCase()){
    case 'setroles':
      if (!args[1].split(",").length){
        message.reply('Please enter a comma separated list (without spaces) of user role names to allow calendar admin functions');
      }

      let verifiedRoles = message.guild.roles.map(role=>role.name.toLowerCase()).filter(r => args[1].split(",").includes(r))

      db.get().collection('guilds').updateOne({_id: `${message.guild.id}`}, {$set: {'settings.allowedRoles': verifiedRoles}}, {
        upsert: true
      }, function(err, response){
        if(err) console.log("admin1 error", err);//throw err; 
        console.log("Admin roles set", verifiedRoles);
        message.reply(`Admin roles set to: ${verifiedRoles.join(", ")}`);
        return;
      }); 
      break;
    case 'addrole':
      if(!message.guild.roles.find(r=>r.name.toLowerCase()=== args[1].toLowerCase())){
        message.reply('Role not found');
        return;
      }
      db.get().collection('guilds').updateOne({_id: `${message.guild.id}`}, {$addToSet: {'settings.allowedRoles': args[1]}}, function(err, resp){
        if(err) console.log('admin2  error', err); //err;
        message.reply(`Role ${args[1]} added to guildBot administrators.`);
        return;
      });
      settings = await db.get().collection('guilds').findOne({_id: `${message.guild.id}`});
      message.reply(`Admin roles updated: ${settings.settings.allowedRoles.join(", ")}`);
      return;
    case 'setprefix':
      db.get().collection('guilds').updateOne({_id: `${message.guild.id}`}, {$set: {'settings.prefix': args[1]}}, {
        upsert: true
      }, function(err, response){
        if(err) console.log('PREFIX ERROR', err); //throw err; 
        message.reply(`Prefix set to: \`${args[1]}\``);
        return;
      }); 
      break;
    case 'getsettings':
      //let settings = await db.get().collection('guilds').findOne({_id: `${message.guild.id}`});
      message.reply(`\nguildBot admin roles: \`${settings.allowedRoles.join(", ")}\`\n\n
      Prefix: \`${settings.prefix}\``);
      return;
  }
    
}
exports.conf ={
  enabled: true,
  permLevel: "admin",
  system: 'guild',
  };  

exports.help = {
  name: "admin",
  category: "guild",
  description: "Configure guild bot permissions and settings",
  usage: [
    "gbotadmin setRoles [COMMA SEPARATED ROLES]",
    "gbotadmin addRole [ROLENAME]",
    "gbotadmin setPrefix [PREFIX]",
    "gbotadmin getSettings"
  ]
};