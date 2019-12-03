const db = require('../handlers/database');


module.exports = async (client, reaction, user) => {
    console.log('REMOVING');
    let msg = reaction.message;
   
    if(client.user.username !== msg.author.username){
        console.log("1")
        return;
    }
    if(user.username ===client.user.username ){
        console.log("2")

        return;
    }
    let url = 'https://discordapp.com/channels/'+ msg.guild.id +"/" + msg.channel.id+"/"+msg.id;
    //https://discordapp.com/channels/626826608862429187/643969832127299595/649080289729052693
    console.log(url);
    let rsvp = await db.get().collection('rsvp').findOne({link: url});
    console.log(rsvp);
    if(!rsvp){
        //rsvp = await db.get().collection('rsvp').findOne({link:reaction.message.id});
        console.log('rsvp not found')
        return;
    }
    
    
    let member = msg.guild.member(user);
    console.log(member);

    console.log(reaction.emoji.name);
    switch(reaction.emoji.name){
        case '👍':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$pull: {confirmed: member.nickname}},
                function(err, r) {
                  if (err) console.log('Confirmation rremove DB ERROR', err);
                  //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                  return;
                }); break;
        case '👎':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$pull: {declined: member.nickname}},
                function(err, r) {
                    if (err) console.log('Decline remove DB ERROR', err);
                    //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                    return;
                }); break;
        case '🤔':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$pull: {tentative: member.nickname}},
                function(err, r) {
                    if (err) console.log('Tentative remove DB ERROR', err);
                    //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                    return;
                }); break;
    }

}