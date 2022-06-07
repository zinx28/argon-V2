const { Message, Client, Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ['a'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const member = message.mentions.members.first() || message.member
            // const user = message.guild.member.get(reason)

            const embed = new MessageEmbed()
                .setTitle(`${member.user.username}'s Avatar`)
                .setColor('PURPLE')
                .setImage(member.user.displayAvatarURL({
                    dynamic: true,
                    size: 1024
                }))
                .addFields(
                    { name: 'Registered!', value: new Date(member.user.createdAt).toLocaleDateString() },
                    { name: 'JOin This server at', value: new Date(member.joinedTimestamp).toLocaleDateString() || "Never this server lul" },
                    { name: 'Nickname', value: member.nickname || "None" },
                    { name: 'Role Count', value: `${member.roles.cache.size - 1}`|| "None" },
                )
                .setFooter(message.author.username)
                .setTimestamp();

            message.reply({ embeds: [embed], content: `${member.user.username}'s Avatar` })




            /*   if(!user){
                   message.channel.send(`This user isnt in this server!`);
               }else{
       
               }*/
        } else {
            message.channel.send(`You only have permission to use the slash commands`);
        }

    },
};
