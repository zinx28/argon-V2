

const { Message, Client, Permissions  } = require("discord.js");

module.exports = {
    name: "shut",
    aliases: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
       if(message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
        message.channel.send("This was a test command/april fools ig");
       }else{
        message.channel.send(`You only have permission to use the slash commands`);
       }

    },
};
