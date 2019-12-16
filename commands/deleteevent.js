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

          calendar.events.delete({calendarId: calendarSettings.calId, eventId: check.data.items[0].id}).then((err, resp)=>{
            if(err) console.log('ERROR deleting event:', err);
            message.reply('Event deleted.')
          })
    } catch(e){
        console.log(e);
    }

}
exports.conf ={
  enabled: true,
  permLevel: "manage",
  system: 'calendar',
  };  
exports.help = {
  name: "deleteevent",
  category: "calendar",
  description: "Delete event from the channel calendar.",
  usage: [
      "deleteEvent [EVENTID]",
      "deleteEvent 191212-1"
  ]
};
