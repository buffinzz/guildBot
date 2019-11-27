require('dotenv').config();
const fs = require('fs');
const db = require('./handlers/database.js');
const Enmap = require("enmap");

const Discord = require('discord.js');
const client = new Discord.Client();

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, (...args) => eventHandler(client, ...args))
  })
})

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


db.connect(function(err) {
  if (err) console.log('Unable to connect to Mongo.', err);
  client.login(process.env.BOT_TOKEN);
})