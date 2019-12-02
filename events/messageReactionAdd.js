const db = require('../handlers/database');


module.exports = async (client, reaction, user) => {
    if(client.user.tag !== reaction.message.author.tag){
        return;
    }
    if(user.tag ===client.user.tag ){
        return;
    }
    let url = 'https://discordapp.com/channels/'+ reaction.message.guild.id +"/" + reaction.message.channel.id+"/"+reaction.message.id;
    let rsvp = await db.get().collection('rsvp').findOne({link:url});
    if(!rsvp){
        console.log('rsvp not found')
        return;
    }
    
    
    let member = await reactions.message.guild.members.find('username', user.username);

    
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