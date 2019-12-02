const db = require('../handlers/database');


module.exports = async (client, reaction, user) => {
    if(client.user.tag !== reaction.message.author.tag){
        return;
    }
    if(user.tag ===client.user.tag ){
        return;
    }
    let rsvp = await db.get().collection('rsvp').findOne({mId:reaction.message.id});
    if(!rsvp){
        //rsvp = await db.get().collection('rsvp').findOne({link:reaction.message.id});
        console.log('rsvp not found')
        return;
    }
    
    
    let member = await reactions.message.guild.members.find('username', user.username);

    
    switch(reaction.emoji.name){
        case '👍':
            db.get().collection('rsvp').updateOne({mId:reaction.message.id},{$pull: {confirmed: member.nickname}},
                function(err, r) {
                  if (err) console.log('Confirmation rremove DB ERROR', err);
                  //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                  return;
                }); break;
        case '👎':
            db.get().collection('rsvp').updateOne({mId:reaction.message.id},{$pull: {declined: member.nickname}},
                function(err, r) {
                    if (err) console.log('Decline remove DB ERROR', err);
                    //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                    return;
                }); break;
        case '🤔':
            db.get().collection('rsvp').updateOne({mId:reaction.message.id},{$pull: {tentative: member.nickname}},
                function(err, r) {
                    if (err) console.log('Tentative remove DB ERROR', err);
                    //message.reply(`Roles ${arg[1]} added to calendar managers.`);
                    return;
                }); break;
    }

}