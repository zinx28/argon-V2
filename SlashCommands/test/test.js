//https://statsproxy-public-service-live.ol.epicgames.com/statsproxy/api/statsv2/query
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const profileExport = require("../../models/user")
const request = require("request");
const { json } = require("express/lib/response");
const fs = require("fs")
const path = require("path")
module.exports = {
    name: "test",
    description: "Dev testing",
    type: 'CHAT_INPUT',
	  options: [{
        name: "id",
        type: 'STRING',
        description: "if needed idk",
        required: false,
    }],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        const discordId = interaction.member.user.id
        profileExport.findOne({
            discord: discordId
        }, (err, Data) => {
            if (!Data) {
                const embed = new MessageEmbed()
                    .setTitle("You Dont Have a account!")
                    .setDescription("Please do /login {auth_code} to login to your epicgames account")
                    .setColor("RANDOM")
                    .setFooter({ text: interaction.member.user.username })
                return interaction.followUp({ embeds: [embed] })
            } else {
									const text = interaction.options.getString("id")
                //   console.log(Data.accountId)
              
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
								const isNeeded = "yes"

								if(isNeeded == "yes"){
							
									 const body = {
							      "appId": "fortnite",
							      "startDate": 0,
							      "endDate": 0,
							      "owners": ["a04f3898e0e441809099b0d4fce2a5ea"],
							      "stats": ["s11_social_bp_level", "s13_social_bp_level", "s14_social_bp_level", "s15_social_bp_level","s16_social_bp_level","s17_social_bp_level","s18_social_bp_level","s19_social_bp_level","s20_social_bp_level"]
							  }
                request(token_request, async function (error, response1) {
                  //  console.log(response1.body)
									console.log(response1.body)
                    const accessToken = JSON.parse(response1.body)['access_token']
                    var auth_request = {
                        "url": `https://events-public-service-live.ol.epicgames.com/api/v1/events/Fortnite/download/${Data.accountId}?region=EU&platform=Windows&teamAccountIds=${Data.accountId}`,
                        "method": "GET",
                        "headers": {
                            'Content-Type': 'application/json',
                            'Authorization': `bearer ${accessToken}`
                        },
                    }
                    request(auth_request, async function (error, response2) {
                        console.log(response2.body)
											var alrv3 = JSON.stringify(JSON.parse(response2.body), null, 2);
											 fs.mkdir("./accounts/" + Data.accountId, (err) => {
                                    fs.writeFile(path.join(`accounts/${Data.accountId}/TEST.json`), alrv3, 'utf8', (err) => {
                                        if (err) {
                                            console.log(`Error writing file: ${err}`);
                                            interaction.editReply("There was an error")
                                        } else {
                                            return interaction.editReply({ content: "Might worked idk", files: [new MessageAttachment(`./accounts/${Data.accountId}/TEST.json`)] })
                                        }
                                    })

                                })
                   //    const NewSec = JSON.parse(response2.body);
                        //const test3 = test2['data']['fortnite']['posts'][0]
                      //  const test3 = NewSec
                      //  var array = [];
                       // for (const index of test3) {
                         //   lol = index['accountId']
                            // console.log(lol)
                         //   array.push("\n" + "•" + lol);
                            //  console.log(array)
                      //  }
                        //console.log(array)
                        interaction.followUp({ content: "porn"})
                    })
                })
								}else{
									 interaction.followUp({ content: "looks like its needed"})
								}
            }
        })
    }
}