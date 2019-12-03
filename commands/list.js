const moment = require('moment-timezone');
const db= require('../handlers/database');
const Discord = require('discord.js');


exports.run = async ( client, message, args, channel, calendarSettings, calendar) => {
let rsvp = await db.get().collection('rsvp').findOne({eId: args[0]});
let msg = new Discord.RichEmbed()
.setColor('#c5002b')
.setTitle(rsvp.name)
.addField('When:', rsvp.date)
.setDescription("RSVPs - members confirmed")//.addBlankField()
.addField('Attending:', rsvp.confirmed.join("\n") || '---', true)
.addField('Not attending:', rsvp.declined.join("\n") ||'---', true)
.addField('Tentative:', rsvp.tentative.join('\n') || '---', true)
.addField('RSVP at:', `${rsvp.link}`, false);

//.setURL(rsvp.link)

message.reply(msg);

  
}
exports.conf ={
  enabled: false,
  permLevel: "manage",
  system: 'calendar',
  };  
exports.help = {
  name: "list",
  category: "calendar",
  description: "Get list of event RSVPs",
  usage: [
    "list [EventID]",
  ]
};
