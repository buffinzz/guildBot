require('dotenv').config();
const fs = require('fs');
const db = require('./handlers/database.js');
const Enmap = require("enmap");

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Enmap();
//Populate command map
fs.readdir("./commands/", (err, files) => {
  if (err){
    console.log('ERROR with Enmap', err);
    return;
  }
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    // Load the command file itself
    let props = require(`./commands/${file}`);
    // Get just the command name from the file name
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    // Here we simply store the whole thing in the command Enmap. We're not running it right now.
    client.commands.set(commandName, props);
  });
});

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, (...args) => eventHandler(client, ...args))
    //return;
  })
})
client.on('raw', packet=>{
  if(!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  const channel = client.channels.get(packet.d.channel_id);
  if(channel.messages.has(packet.d.message_id)) return;
  channel.fetchMessage(packet.d.message_id).then( message =>{
    const emoji = packet.d.emoji.id && packet.d.emoji.id.length ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
   
    const reaction = message.reactions.get(emoji);
    let u = client.users.find(user=> user.id === packet.d.user_id);
    console.log(packet.t)
    if(packet.t === 'MESSAGE_REACTION_ADD'){
      client.emit('messageReactionAdd', reaction, u);
    }
    if(packet.t === 'MESSAGE_REACTION_REMOVE'){
      client.emit('messageReactionRemove', reaction, u);
    }
  })
})




db.connect(function(err) {
  if (err) console.log('Unable to connect to Mongo.', err);
  client.login(process.env.BOT_TOKEN);
})