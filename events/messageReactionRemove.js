const db = require('../handlers/database');


module.exports = async (client, reaction, user) => {
    // console.log('REMOVING', user.username);
    // console.log(reaction.emoji.name);
    
   
    if(client.user.username !== reaction.message.author.username)return;
    if(user.username ===client.user.username )return;
    let msg = reaction.message;
    let url = 'https://discordapp.com/channels/'+ msg.guild.id +"/" + msg.channel.id+"/"+msg.id;
    //https://discordapp.com/channels/626826608862429187/643969832127299595/649080289729052693
    //console.log(url);
    let rsvp = await db.get().collection('rsvp').findOne({link: url});
    //console.log(rsvp);
    if(!rsvp)return;
    
    
    let member = msg.guild.member(user);

    switch(reaction.emoji.name){
        case '👍':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$pull: {confirmed: member.nickname !== null ? member.nickname : member.user.username}},
                function(err, r) {
                  if (err) console.log('Confirmation rremove DB ERROR', err);
                  //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                  return;
                }); break;
        case '👎':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$pull: {declined: member.nickname !== null ? member.nickname : member.user.username}},
                function(err, r) {
                    if (err) console.log('Decline remove DB ERROR', err);
                    //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                    return;
                }); break;
        case '🤔':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$pull: {tentative: member.nickname !== null ? member.nickname : member.user.username}},
                function(err, r) {
                    if (err) console.log('Tentative remove DB ERROR', err);
                    //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                    return;
                }); break;
    }

}