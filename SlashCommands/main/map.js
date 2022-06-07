const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const profileExport = require("../../models/user")
const request = require("request");
const { json } = require("express/lib/response");
const mapig = require('./map.json')
module.exports = {
    name: "map",
    description: "You dont need to have access to a account to use this command",
    type: 'CHAT_INPUT',
    options: [{
        name: "mapversion",
        type: 'STRING',
        description: "Fortnite Map Version",
        required: false,
    },
    {
        name: "showpois",
        type: 'BOOLEAN',
        default: false,
        description: "Fortnite Map Version",
        required: false,
    }],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: false }).catch(() => { });
        const text = interaction.options.getString("mapversion")
        const showPois = interaction.options.getBoolean("showpois")
        showPOIS69 = ""
        if(showPois == true){
            showPOIS69 = "?showPOI=true"
        }else{
            showPOIS69 = ""
        }
        console.log(showPois)
        if (text == null) {
            const embed = new MessageEmbed()
                .setTitle("Latest Map Version")
            
                .setImage(`https://media.fortniteapi.io/images/map.png${showPOIS69}`)
                .setColor("RANDOM")
                .setFooter({ text: "some random thingy" })
            return interaction.followUp({ embeds: [embed] })
        } else {
            if (mapig[text]) {
                const embed = new MessageEmbed()
                    .setTitle(`${text} Map Version`)
                    .setImage(`https://media.fortniteapi.io/images/maps/${mapig[text]}${showPOIS69}`)
                    .setColor("RANDOM")
                    .setFooter({ text: "some random thingy" })
                return interaction.followUp({ embeds: [embed] })
            } else {
                const embed = new MessageEmbed()
                    .setTitle("Invaild Map")
                    .setDescription(`${text} isnt a vaild map!`)
                    .setColor("RANDOM")
                    .setFooter({ text: "if its the latest then use /map" })
                return interaction.followUp({ embeds: [embed] })
            }
        }
    }
}