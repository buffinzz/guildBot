const moment = require('moment-timezone');
const Discord = require('discord.js');
const db= require('../handlers/database');


exports.run = async ( client, message, args, channel, calendarSettings, calendar) => {
  console.log("displaying upcoming", args);
// [ '191112-1', '<#642836035574693928>' ]
 if(!calendarSettings || !calendarSettings.calId || !calendarSettings.calId.length){
     console.log(calendarSettings);
    let setup = client.commands.get('setup');
    message.reply("This channel doesn't have a calendar setup yet.\n" + setup.help.usage);
    return;
 }
 if(args.length!==0 && args.length !== 1 && args.length !==3){
   message.reply("Incorrect command usage: please include either an event id or and event id and 2 channels:\n" + exports.help.usage);
   return;
 }
 let responseChannel;
 if(args.length >1){
  if (args[2].startsWith('<#') && args[2].endsWith('>')){
    responseChannel = args[2].slice(2, -1);
    responseChannel = client.channels.get(responseChannel);
  } else {
    responseChannel = message.guild.channels.find(channel => channel.name === args[2]);
   }
   
  } else {
    responseChannel = message.channel;
  }

 if(!responseChannel){
  message.reply("Channel not found: " + args[2] +"\n"+exports.help.usage);
  return;
 }
 let msg = '__**Upcoming Events:**__\n\`';
 let num = args[0] > 0 && args[0]< 7 ? args[0] : 7;
  try{
    const check = await calendar.events.list({
      calendarId: calendarSettings.calId,
      singleEvents: true,
      timeMin: (new Date()).toISOString(),
      orderBy: 'startTime',
      maxResults: num,
    });
    console.log("EVENTS FETCHED", check);
    if(!check.data.items.length){
      message.reply('No Events found');
      return;
    }

    check.data.items.forEach(event=>{
        let start = event.start.dateTime ? moment(event.start.dateTime).format("MMM D, h:mma") : moment(event.start.date).format("MMM D, ") + 'all day';
            //let date = new Date();
        msg = msg + `${start}\t ${event.location}\t${event.summary}\n`;
    });
    msg = msg + "\`";
    responseChannel.send(msg);
      return;
  } catch(e){
    console.log("ERROR FETCHING", e);
    return;
  }
  
}
exports.conf ={
  enabled: true,
  permLevel: "manage",
  system: 'calendar',
  };  
exports.help = {
  name: "upcoming",
  category: "calendar",
  description: "Post upcoming events.",
  usage: [
    "upcoming [#CHANNELOFCALENDAR](optional) [#CHANNELTOPOST](optional)\nIf no channels are mentioned, the current channel's calendar will be used, and the calendar will be posted in the current channel.",
    "upcoming 4",
    "upcoming 7 #calendar #general"
  ],
};
