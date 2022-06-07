const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const profileExport = require("../../models/user")
const TwitterExport = require("../../models/twitter")
const request = require("request");
const fs = require("fs")
const path = require("path")
module.exports = {
	  name: "purchases",
    description: "Other Ways To puraces",
    type: 'CHAT_INPUT',
    options: [{
        name: "vbucks",
        type: 'STRING',
        description: "Dev Command - public as well ofc!",
        required: true,
        choices: [{
            name: "100 vbucks",
            description: "Your account profiles",
            type: 'CHAT_INPUT',
            value: "100",
        }]
    }],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
				 const idThingy = interaction.options.getString('vbucks')

			if(idThingy == "100"){
				return interaction.followUp({content: "https://launcher-website-prod07.ol.epicgames.com/purchase?showNavigation=false&namespace=fn&offers=48a61f0d493942909a529369a66f803b"})
			}
		}
}