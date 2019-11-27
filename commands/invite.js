const moment = require('moment-timezone');
const db= require('../handlers/database');


exports.run = async ( client, message, args, channel, calendarSettings, calendar) => {
  console.log(args);

 if(args.length !==3){
   message.reply("Incorrect command usage: please include either an event id or and event id and 2 channels:\n" + exports.help.usage);
   return;
 }
 let share = await db.get().collection('rsvp').findOne({gId: message.guild.id, cId:calendarSettings.cId, eId:args[0]});
console.log("SAHRE", share);
 let responseChannel;
  if (args[2].startsWith('<#') && args[2].endsWith('>')){
    responseChannel = args[2].slice(2, -1);
    responseChannel = client.channels.get(responseChannel);
  } else {
    responseChannel = message.guild.channels.find(channel => channel.name === args[2]);
   }

 if(!responseChannel){
  message.reply("Channel not found: " + args[2] +"\n"+exports.help.usage);
  return;
 }

 responseChannel.send(`RSVP to event posted in ${channel.toString()}\n${share.name} at ${share.date} : <${share.link}>`)
  
  
}
exports.conf ={
  enabled: true,
  permLevel: "manage",
  system: 'calendar',
  };  
exports.help = {
  name: "invite",
  category: "calendar",
  description: "Share link to discord post for event RSVP",
  usage: [
    "invite [EventID] [#CHANNELOFCALENDAR] [#CHANNELTOPOST]",
  ]
};
