const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const profileExport = require("../../models/user")
const TwitterExport = require("../../models/twitter")
const request = require("request");
const fs = require("fs")
const path = require("path")
module.exports = {
    name: "settings",
    description: "This is everything about your account!",
    type: 'CHAT_INPUT',
    options: [{
        name: "set",
        type: 'STRING',
        description: "What do you want to download!",
        required: true,
        choices: [{
            name: "twitter-api-keys",
            description: "Da Twitter Keys",
            type: 'CHAT_INPUT',
            value: "twitter-api-keys",
        },
        {
            name: "auto-tweet",
            description: "Your account auto or the list ig",
            type: 'CHAT_INPUT',
            value: "auto-tweet",
        }]
    },
    {
        name: "twitter-apis",
        type: 'STRING',
        description: "This will only work if you chose profile",
        required: false,
        choices: [{
            name: "appKey",
            description: "Da Twitter Keys",
            type: 'CHAT_INPUT',
            value: "appKey",
        },
        {
            name: "appsecret",
            description: "Da Twitter Keys",
            type: 'CHAT_INPUT',
            value: "appsecret",
        },
        {
            name: "accesstoken",
            description: "Da Twitter Keys",
            type: 'CHAT_INPUT',
            value: "accesstoken",
        },
        {
            name: "accesssecret",
            description: "Da Twitter Keys",
            type: 'CHAT_INPUT',
            value: "accesssecret",
        }]
    },
    {
        name: "id",
        type: 'STRING',
        description: "depends what you choose",
        required: false,
    }
    ],
    run: async (client, interaction, args) => {
				//await interaction.deferReply().catch(() => { });
				await interaction.deferReply({ephemeral: true}).catch(() => { });
				interaction.followUp("Loading!")
        const whattodo = interaction.options.getString('set')
        const sett = interaction.options.getString('twitter-apis')
			 const idThingy = interaction.options.getString('id')
        const discordId = interaction.member.user.id
        profileExport.findOne({
            discord: discordId
        }, (err, Data) => {
            if (!Data) { 
								PublicOrPrivate(true)
              // await interaction.deferReply({ ephemeral: true }).catch(() => { });
                return interaction.followUp("Hey You Dont a account please login with /login {Auth}")
            }else{
            if (whattodo == "twitter-api-keys") {
              //  await interaction.deferReply({ ephemeral: true }).catch(() => { });
									
									TwitterExport.findOne({
										discord: discordId
									}, (err, Data) => {
										if(!Data) {
											
											return interaction.followUp("So how you dont have access to the twitter stuff -- strange -_-!")
										}else{
											//PublicOrPrivate(true)
											if(sett == "appKey"){
												TwitterExport.collection.updateOne({ discord: discordId }, { $set: { appKey: idThingy} })
											}else if(sett == "appsecret"){
												TwitterExport.collection.updateOne({ discord: discordId }, { $set: { appSecret: idThingy} })
											}else if(sett == "accesstoken"){
												TwitterExport.collection.updateOne({ discord: discordId }, { $set: { accessToken: idThingy} })
											}else if(sett == "accesssecret"){
												TwitterExport.collection.updateOne({ discord: discordId }, { $set: { accessSecret: idThingy} })
											}else{
												//PublicOrPrivate(true)
												interaction.editReply({ content:"There was an err make sure that you put the correct values", ephemeral: true})
											}
											if(sett == null){
												
											}else{
											return interaction.editReply({ content:"I Have Changed your " + sett + " To " + idThingy, ephemeral: true})
											}
										}
									})
              
            } else {
							//	PublicOrPrivate(true)

								//return interaction.followUp("THERE IS A UNKNOWN ERR AHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAH HELP ME NOWWWW!!!!!!!!!!!!!!!!!!") // idk
                if (sett == null) {
										PublicOrPrivate(false)
                //    await interaction.deferReply({ ephemeral: false }).catch(() => { });
                    return interaction.followUp("This code isnt done yet! -- sett == null")
                } else {
										PublicOrPrivate(true)
                  //  await interaction.deferReply({ ephemeral: true }).catch(() => { });
                    return interaction.followUp("Hey!, You Dont want to be leaking your twitter ids please do /settings twitter-api-keys (then the id of choice)")
                }
            }
						}
        })
			async function PublicOrPrivate (something) {
				if(something == true){
					await interaction.deferReply({ ephemeral: true }).catch(() => { });
					interaction.followUp("Loading!")
				}else if(something == false){
					await interaction.deferReply({ ephemeral: false }).catch(() => { });
					interaction.followUp("Loading!")
				//	interaction.followUp("THIS IS PROOF THAT IT WORKS BUT THE BOT IS DUMB AS FUCK!")
				}else if(something == "e"){
					await interaction.deferReply().catch(() => { });
					interaction.followUp("Loading!")
				}else{
					await interaction.deferReply({ ephemeral: true }).catch(() => { });
					 return interaction.followUp("Whoops look in settings.js as check if PublicOrPrivate isnt invaild")
				}
			}
		}
}