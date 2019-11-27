
const db= require('../handlers/database');
const moment = require('moment-timezone');
  
exports.run = async ( client, message, args, channel, calendarSettings, calendar) => {
  
  switch(args[0].toLowerCase()){
    case 'managerset':
      const roles = args[1].split(",") || '';
      if (!roles.length){
        message.reply('Please enter a comma separated list (without spaces) of user role names to allow calendar manage functions');
      }
      //===============================
      // @TODO validate calendar url
      //================================
      let verifiedRoles = message.guild.roles.map(role=>role.name.toLowerCase()).filter(r => roles.includes(r));

      db.get().collection('calendars').updateOne({_id: `${message.guild.id}${channel.id}`},{$set: {managers: verifiedRoles}}, {
        upsert: true
      }, function(err, r) {
        if (err) console.log('Setup manager set db ERROR', err);
        message.reply("Manager roles for this calendar set to: " + verifiedRoles.join(", "));
        return;
      }); break;
    case 'manageradd':
        if(!message.guild.roles.find(r=>r.name === arg[1])){
          message.reply('Role not found');
        }
        db.get().collection('calendars').updateOne({_id: `${message.guild.id}${channel.id}`},{$addToSet: {managers: arg[1]}},
        function(err, r) {
          if (err) console.log('Manager add DB ERROR', err);
          message.reply(`Roles ${arg[1]} added to calendar managers.`);
          return;
        }); break;
    case 'addcalendar':
      try{
        const cal = await calendar.calendars.get({calendarId: args[1]});
        let setting = {gId: message.guild.id, cId: channel.id, calId: args[1]};
        if(!calendarSettings || !calendarSettings.tz || !calendarSettings.tz.length){
          setting.tz = cal.data.timeZone;
        }
        db.get().collection('calendars').updateOne({_id: `${message.guild.id}${channel.id}`},{$set: setting}, {
          upsert: true
        }, function(err, r) {
          if (err) console.log('setup add Cal DB ERROR', err);
          message.reply(`Calendar Added to channel <#${channel.id}> : ${cal.data.summary}`)
          return;
        });
      } catch(e){
        console.log('CALENDAR GET ERROR', e);
        if(e.errors[0].reason.includes('notFound'))message.reply(`The calendar ID ${args[1]} either does not exist, or GuildBot does not have access to this calendar. Please be sure to share your google calendar with guildcalendarbot@dragonite.iam.gserviceaccount.com and allow this account to manage events.`)
      }
      break;
    case 'tz':
      if(!moment.tz.zone(args[1])) message.reply('Invalid Timezone - ex: "America/Los_Angeles"');
      db.get().collection('calendars').updateOne({_id: `${message.guild.id}${channel.id}`},{$set: {gId: message.guild.id, cId: channel.id, tz: args[1]}}, {
        upsert: true
      }, function(err, r) {
        if (err) console.log("Setup TZ DB ERROR", err);
        message.reply(`Timezone set to: **${args[1]}`)
        return;
      }); break;
    case 'getsettings':
      if(args.length > 1 && exports.conf.settings.includes(args[1].toLowerCase())){
        let key = exports.conf.keys[args[1].toLowerCase()];
        message.reply(`${key} is set to ${calendarSettings[key]}`);
        return;
      }
      let msg = `Settings for <#${calendarSettings.cId}> calendar\n`;
      for(var k in exports.conf.keys){
        msg = msg+`**${k}** is *${calendarSettings[exports.conf.keys[k]] || 'not set'}*\n\n`;
      }
      message.reply(msg);
      return;
  }
}
exports.conf ={
  enabled: true,
  permLevel: "admin",
  system: 'calendar',
  settings: ['tz', 'calid', 'managers'],
  keys: {
    'tz': 'tz',
    'calid': 'calId',
    'managers': 'managers'
  },
  };  
exports.help = {
  name: "setup",
  category: "calendar",
  description: "Configure channel calendars.",
  usage: [
    "setup addCalendar [CALENDARID]",
    "setup tz [TIMEZONE]",
    "setup managerSet [COMMA SEPARATED ROLES]",
    "setup managerAdd [ROLE]",
    "setup getSettings"
  ]
};
