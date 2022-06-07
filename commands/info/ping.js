const { Message, Client, Permissions  } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ['p'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
       if(message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
         message.channel.send(`${client.ws.ping} ws ping`);
       }else{
        message.channel.send(`You only have permission to use the slash commands`);
       }

    },
};
