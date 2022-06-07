const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const profileExport = require("../../models/user")
const request = require("request");
const { json } = require("express/lib/response");
const fs = require("fs")
const path = require("path")
module.exports = {
    name: "vbucks",
    description: "shows how much gold you have",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: false }).catch(() => { });
        const discordId = interaction.member.user.id
        profileExport.findOne({
            discord: discordId
        }, (err, Data) => {
            if (!Data) {
                const embed = new MessageEmbed()
                    .setTitle("You Dont Have a account!")
                    .setDescription("Please do /login {auth_code} to login to your epicgames account")
                    .setColor("RANDOM")
                    .setFooter({ text: interaction.member.user.username });
                return interaction.followUp({ embeds: [embed] })
            } else {
							 const embed2 = new MessageEmbed()
								.setColor('RANDOM')
								.setTitle("Checking if you still have access to your account!");
								  interaction.editReply({ embeds: [embed2] });
							var token_request = {
                    "url": `https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token`,
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=`
                    },
                    //  "body": "{}",
                    form: {
                        'grant_type': 'device_auth',
                        'account_id': Data.accountId,
                        'device_id': Data.devicecode,
                        'secret': Data.secret
                    },
                }
                request(token_request, async function (error, response1) {
                    const accessToken = JSON.parse(response1.body)['access_token']
									 	const displayName = JSON.parse(response1.body)['displayName']
									 	var vbucksgrab = {
                                "url": `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${Data.accountId}/client/QueryProfile?profileId=common_core&rvn=-1`,
                                "method": "POST",
                                "headers": {
                                    'Content-Type': 'application/json',
                                    'Authorization': `bearer ${accessToken}`
                                },
                                'body': "{}"
                            }
									 		request(vbucksgrab, function (error, response1) {
                            var alr = JSON.parse(response1.body);
												    var idk = alr['profileChanges'][0]['profile']
												console.log(idk)
                            const embed = new MessageEmbed()
                            .setColor('RANDOM')
                            .setTitle("Vbucks")
                            .setDescription("You have ??? Vbucks")
                            .setTimestamp()
												    .setFooter({text: `You are currently logged in to ${displayName}`})
												    
                            return interaction.editReply({ embeds: [embed], Content: ""});
                            //return interaction.followUp({ attachments: [attachment]})
                        })
								})
						}
				})
    },
};
