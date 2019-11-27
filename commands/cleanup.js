exports.run = async ( client, message, args, settings ) => {
  console.log("ARGS",args)
//   channel.fetchMessages({
//     limit: numberMessages
//   }).then((messages) => { //If the current calendar is deleted
//     messages.forEach(function(message) {
    
}
exports.conf ={
  enabled: false,
  permLevel: "manage",
  system: 'guild',
  };  

exports.help = {
  name: "cleanup",
  category: "guild",
  description: "Cleanup bot messages",
  usage: [
    "cleanup [NUMBER]",
    "cleanup all",
  ]
};