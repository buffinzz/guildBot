const moment = require('moment-timezone');
const dateFormats = ["YYYY-MM-DD", "YYYY/MM/DD"];

exports.run = async ( client, message, args, channel, calendarSettings, calendar) => {
    try{
        const check = await calendar.events.list({
          calendarId: calendarSettings.calId,
          singleEvents: true,
          sharedExtendedProperty: `botId=${args[0]}`,
        });
        if(!check.data.items.length){
            message.reply('Event ID not found on this calendar');
            return;
          }
          if(check.data.items.length > 1){
            message.reply ('Something went wrong... duplicate event id');
            return;
          }
          // @ToDo 
          // [ ] add confirmation
          // [ ] cleanup database entries / discord messages?

          calendar.events.patch({calendarId: calendarSettings.calId, eventId: check.data.items[0].id}).then((err, resp)=>{
            if(err) console.log('ERROR deleting event:', err);
            message.reply('Event deleted.')
          })
    } catch(e){
        console.log(e);
    }

}
exports.conf ={
  enabled: false,
  permLevel: "manage",
  system: 'calendar',
  };  
exports.help = {
  name: "updateevent",
  category: "calendar",
  description: "update event from the channel calendar.",
  usage: [
      "updateEvent [EVENTID] [param]=[value]",
      "updateEvent 191212-1 time=8:30pm-10:00pm; description=This the description; title=What we're doing"
  ]
};
