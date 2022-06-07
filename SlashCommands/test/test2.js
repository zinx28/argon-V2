//https://statsproxy-public-service-live.ol.epicgames.com/statsproxy/api/statsv2/query
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const profileExport = require("../../models/user")
const request = require("request");
const { json } = require("express/lib/response");
module.exports = {
    name: "test123",
    description: "Dev testing",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        const discordId = interaction.member.user.id
			  if(discordId == "887059055770730499"){
					 const embed = new MessageEmbed()
							.setTitle("Welcome to the Official OutLine Api discord server!")
							.setDescription("Before chatting you will need to follow these rules")
							.addFields(
								{ name: '1)', value: 'Do **NOT** SPAM' },
								{ name: '2)', value: 'Do not Raid/Nuke the Discord Server' },
								{ name: '3)', value: 'Respect everyone the way you want to be treated.' },
								{ name: '4)', value: 'No NSFW content' },
								{ name: '5)', value: 'Dont ping staff if you need help ask in support and wait' },
								{ name: '6)', value: 'Do not advertise in this server we will immediately ban you!' },
								{ name: '7)', value: 'Follow the discord **tos** https://discord.com/terms' },
								{ name: '8)', value: 'Follow the discord **guidelines** https://discord.com/guidelines' },
							)			
							.setColor("RANDOM")
							.setFooter({ text: "" })
           interaction.followUp("TEST")
					return interaction.channel.send({ embeds: [embed] })
				}else{
				 interaction.followUp("You dont have permission or command is disabled!")
				}
		}
}