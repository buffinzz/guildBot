const db = require('../handlers/database');


module.exports = async (client, reaction, user) => {
    //console.log('REACTING', reaction);
   
    let msg = reaction.message;//message && message !== null ? message : reaction.message;
   
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
    //console.log(url);
    let rsvp = await db.get().collection('rsvp').findOne({link: url});
    //console.log(rsvp);
    if(!rsvp){
        //rsvp = await db.get().collection('rsvp').findOne({link:reaction.message.id});
        console.log('rsvp not found')
        return;
    }
    
    
    let member = msg.guild.member(user);//await message.guild.members.get(m=> m.username === user.username);

    console.log(reaction.emoji.name);
    
    
    //let member = await reaction.message.guild.members.find(m=> m.username === user.username);

    
    switch(reaction.emoji.name){
        case '👍':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$addToSet: {confirmed: member.nickname}},
                function(err, r) {
                  if (err) console.log('Confirmation add DB ERROR', err);
                  return;
                }); break;
        case '👎':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$addToSet: {declined: member.nickname}},
                function(err, r) {
                    if (err) console.log('Decline add DB ERROR', err);
                    return;
                }); break;
        case '🤔':
            db.get().collection('rsvp').updateOne({_id: rsvp._id},{$addToSet: {tentative: member.nickname}},
                function(err, r) {
                    if (err) console.log('Tentative add DB ERROR', err);
                    return;
                }); break;
    }

}