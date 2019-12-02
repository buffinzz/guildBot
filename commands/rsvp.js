const moment = require('moment-timezone');
const Discord = require('discord.js');
const db= require('../handlers/database');


exports.run = async ( client, message, args, channel, calendarSettings, calendar) => {
  console.log(args);
// [ '191112-1', '<#642836035574693928>' ]
 if(!calendarSettings.calId || !calendarSettings.calId.length){
     console.log(calendarSettings);
    let setup = client.commands.get('setup');
    message.reply("This channel doesn't have a calendar setup yet.\n" + setup.help.usage);
    return;
 }
 if(args.length !== 1 && args.length !==3){
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
 let msg = new Discord.RichEmbed()
  try{
    const check = await calendar.events.list({
      calendarId: calendarSettings.calId,
      singleEvents: true,
      sharedExtendedProperty: `botId=${args[0]}`,
    });
    console.log("EVENTS", check.data);
    if(!check.data.items.length){
      message.reply('Event ID not found on this calendar');
      return;
    }
    if(check.data.items.length > 1){
      message.reply ('Something went wrong... duplicate event id');
      return;
    }

    const event = check.data.items[0];
    //console.log("EVENT START", event.start);
    let date = event.start.dateTime ? moment(event.start.dateTime).format("MMM Do YYYY - h:mma") : moment(event.start.date).format("MMM Do YYYY") + ' - all day';
    let author = "\#" + channel.name + ' Calendar - ';
    msg.setColor('#663399')
      .setTitle(event.summary)
      .setURL(event.htmlLink)
      .setAuthor( author.toUpperCase() + message.member.nickname, message.author.avatarURL)
      .addField('When:', date)
      .setDescription(event.description)//.addBlankField()
      .addField('Share RSVP link to this $calendarevent:', `!invite ${event.location} ${channel.toString()} [#CHANNEL]`);
      responseChannel.send(msg).then((sent)=>{
        sent.react('👍')
                .then(()=>sent.react('👎'))
                .then(()=>sent.react('🤔'))
                .then(()=> {
                  let newEvent = event;
                  newEvent.source.url = 'https://discordapp.com/channels/'+ seent.guild.id +"/" + sent.channel.id+"/"+sent.id;
                  calendar.events.update({calendarId:calendarSettings.calId,eventId: event.id, requestBody:newEvent}).then(resp =>{
                    console.log("UPDATED EVENt", resp);
                  })
                  db.get().collection('rsvp').updateOne({gId: message.guild.id, cId: channel.id, eId: event.location},{$set: {mId: sent.id, link: newEvent.source.url, date: date, name: event.summary}}, {
                    upsert: true
                  }, function(err, response){
                    if(err) throw err; 
                    console.log("Event logged");
                  }); 
                });
      });
      return;
  } catch(e){
    console.error('RSVP error',e);
    return;
  }
  
}
exports.conf ={
  enabled: true,
  permLevel: "manage",
  system: 'calendar',
  };  
exports.help = {
  name: "rsvp",
  category: "calendar",
  description: "Post and invitation to an event for RSVPs.",
  usage: [
    "rsvp [EventID] [#CHANNELOFCALENDAR](optional) [#CHANNELTOPOST](optional)\nIf no channels are mentioned, the current channel's calendar will be used, and the invitation will be posted in the current channel.",
  ]
};
