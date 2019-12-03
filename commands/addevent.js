const moment = require('moment-timezone');
const dateFormats = ["YYYY-MM-DD", "YYYY/MM/DD"];
let event = {
    'summary': '',
    'description': '',
    'start': {
        'date': '',
        'dateTime': '',
        'timeZone': 'America/New_York',
    },
    'end': {
        'date' : '',
        'dateTime': '',
        'timeZone': '',
    },
    "source": {
        "url": '',
        "title": 'RSVP on Discord'
    },
    "extendedProperties":{
        "shared" : {
        "botCreator" : '',
        "botId": ''
        }
    },
    "location":''
    };
exports.run = async ( client, message, args, channel, calendarSettings, calendar) => {
    console.log('adding event...', message.content, args);
 if(!calendarSettings || !calendarSettings.calId || !calendarSettings.calId.length){
     console.log('CAL SETTINGS', calendarSettings);
    let setup = client.commands.get('setup');
    message.reply("This channel doesn't have a calendar setup yet.\n" + setup.help.usage);
    return;
 }
 if(args.length<3){
     message.reply("Not enough arguments:\n" + exports.help.usage);
     return;
 }
 const split = message.content.split(" ::: ");
 if(!moment(args[0], dateFormats).isValid()) {
    console.log("INVALID DATE", args[0])
    //message.reply(errMsg);
    message.reply('Invalid date format: ' + exports.help.usage);
    return;
    }
let time = args[1].split("-");
if(time[0] != 'all-day'){
    if(moment(time[0], 'h:mma').isValid() != true || (time.length==2 && moment(time[1], 'h:mma').isValid() != true) || time.length>2){
        console.log("INVALID TIME", time)
        message.reply('Invalid time format: ' + exports.help.usage);
        return;
    }
    delete event.end.date;
    delete event.start.date;

    let startdate = moment(args[0], dateFormats).format('YYYY-MM-DD');
    event.start.dateTime = moment(startdate + " " + time[0], 'YYYY-MM-DD h:mma').tz(calendarSettings.tz).format()//'YYYY-MM-DDTHH:mmZ');
    if(time.length == 1){
        delete event.end.dateTime;
        //2015-05-28T17:00:00-07:00
        //event.end.date = startdate;
        event.end.dateTime = moment(startdate + " " + time[0], 'YYYY-MM-DD h:mma').tz(calendarSettings.tz).format()//'YYYY-MM-DDTHH:mmZ');
    } else{
        if(time[0].toLowerCase().includes("pm") && time[1].toLowerCase().includes('am')){
        let end = event.end.dateTime = moment(startdate + " " + time[1], 'YYYY-MM-DD h:mma').add(1, 'days');//('YYYY-MM-DDTHH:mmZ');
            event.end.dateTime = end.tz(calendarSettings.tz).format();
        } else {
        event.end.dateTime = moment(startdate + " " + time[1], 'YYYY-MM-DD h:mma').tz(calendarSettings.tz).format()//('YYYY-MM-DDTHH:mmZ');
        }
    }
} else {
    //what does google api want to indicate all day??
    delete event.start.dateTime;
    delete event.end.dateTime;
    event.start.date = startdate;
    event.end.date = startdate;
    }
    console.log("EVT",event);
event.timeZone = calendarSettings.tz;
event.description = split.length > 1 ? split[1] : '';
let title = split[0].split(" ")
title=title.slice(3);

event.summary = title.join(" ");
try{
    let dateCheck = event.start.date || event.start.dateTime;
    dateCheck = moment(dateCheck).format("YYYY-MM-DD");
    dateCheck = moment(`${dateCheck} 12:00 AM`, "YYYY-MM-DD hh:mm A").format();
    let dateCheck2= moment(`${dateCheck} 11:59 PM`, "YYYY-MM-DD hh:mm A").format();
    const check = await calendar.events.list({calendarId: calendarSettings.calId, singleEvents: true, timeMin: dateCheck, timeMax: dateCheck2});
    let count = check.data.items.length + 1;
    event.extendedProperties.shared.botId = moment(dateCheck).format('YYMMDD') + "-" + count;
    event.location = event.extendedProperties.shared.botId;
    event.source.url=`https://discordapp.com/channels/${message.guild.id}/`;
    event.extendedProperties.shared.botCreator = message.member.nickname;
    try{
        const result = await calendar.events.insert({calendarId: calendarSettings.calId, requestBody: event});
        message.reply(`Your event was successfully created for calendar <#${channel.id}>: ${result.data.location} - <${result.data.htmlLink}>`)
        return;
      }catch(e){
        console.error('INSERT ERRORS', e);
        if(e.errors[0].reason === 'requiredAccessLevel'){
            message.reply('GuildBot does not have permission to access your google calendar. Please share your calendar with guildcalendarbot@dragonite.iam.gserviceaccount.com and allow this account to manage your events.')
        }

      }
} catch(e){
    console.error('GET EVENTS ERROR', e);
    if(e.errors[0].reason.includes('notFound'))message.reply(`The calendar ID ${args[1]} either does not exist, or GuildBot does not have access to this calendar. Please be sure to share your google calendar with guildcalendarbot@dragonite.iam.gserviceaccount.com and allow this account to manage events.`)
    return;
}

}
exports.conf ={
  enabled: true,
  permLevel: "manage",
  system: 'calendar',
  };  
exports.help = {
  name: "addevent",
  category: "calendar",
  description: "Add event to channel calendar.",
  usage: [
      "addevent [YYYY/MM/DD] [STARTIME]-[ENDTIME] (end optional) [TITLE] ::: [DESCRIPTION](optional) [#CHANNEL](optional)",
      "addEvent 2019/11/22 7:30pm-10:30pm Molten Core ::: Invites start at 7pm",
      "addEvent 2019-12-31 5:00pm Onyxia's Lair ::: More Dots! #calendar",
      "addEvent 2020-01-15 6:00pm-7:00pm Scholomance ::: #lfg",
      "addEvent 2020-01-25 6:00pm UBRS",
  ]
};
