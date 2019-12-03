const {google} = require('googleapis');
const db = require('../handlers/database');
// const auth = new google.auth.GoogleAuth({
//   scopes: ['https://www.googleapis.com/auth/calendar'],
// });
// google.options({auth: auth});

module.exports = async (client, message) => {
  if (message.author.bot) {
    return;
  }
  const g = await db.get().collection('guilds').findOne({_id: message.guild.id}, {_id:0, settings: 1});//'settings.prefix': 1, 'settings.allowedRoles': 1});
  const settings = g.settings;

  const prefix = settings && settings.prefix ? settings.prefix : "!";

  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if(message.content.match(prefixMention)){
    return message.reply(`My prefix is set to \`${prefix}\``);
  }
  
  if(message.content.toLowerCase().indexOf(prefix.toLowerCase()) !== 0) return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(message.guild && !message.member) await message.guild.fetchMember(message.author);

  const cmd = client.commands.get(command);

  if(!cmd) return;
  const roles=message.member.roles.map(x=>x.name.toLowerCase());
  var results = [];
  for (var i = 0; i < roles.length; i++) {
      if (settings.allowedRoles.indexOf(roles[i]) !== -1) {
          results.push(roles[i]);
      }
  }

  if(cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a channel.");
  if(cmd.conf.permLevel === 'admin'
      && cmd.conf.system === 'guild' 
      && (!results.length && !message.member.hasPermission('MANAGE_WEBHOOKS'))){
        console.log('PERMISSIONS')
    return;
  }
//   for (var i = 0; i < roles.length; i++) {
//     if (settings.allowedRoles.indexOf(roles[i]) !== -1) {
//         results.push(roles[i]);
//     }
// }
  if(cmd.conf.system === 'calendar'){
    // const auth = new google.auth.GoogleAuth({
    //   scopes: ['https://www.googleapis.com/auth/calendar'],
    // });
    //google.options({auth: auth});
    let channelMentions =  message.content.match(/<#(\d+)>/);
    let channel = message.channel;
    if(channelMentions){
      channel = message.guild.channels.find(channel=>channel.id = channelMentions[1])
    }
    //let channel = message.mentions && message.mentions.channel ? message.mentions.channel.first() : message.channel;
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const calendar = google.calendar({version: 'v3', auth});
    const calendarSettings = await db.get().collection('calendars').findOne({_id: `${message.guild.id}${channel.id}`}, {_id:0});
    
    if(cmd.conf.permLevel === 'admin' && (!results.length && !message.member.hasPermission('MANAGE_WEBHOOKS'))){
      return;
    }
    let managers = calendarSettings && calendarSettings.managers ? calendarSettings.managers : [];
    if(cmd.conf.permLevel === 'manage' && (!results.length && !message.member.hasPermission('MANAGE_WEBHOOKS') && !roles.filter(x=>managers.includes(x)).length)){
      console.log("PERMISSIONs", results)
      return;
    }
    //const calendar = new google
    cmd.run(client, message, args, channel, calendarSettings, calendar);
    return;
  }
  cmd.run(client, message, args, settings);
}