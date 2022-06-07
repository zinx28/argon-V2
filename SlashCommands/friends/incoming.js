const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const profileExport = require("../../models/user")
const request = require("request");
const { json } = require("express/lib/response");
module.exports = {
    name: "incoming",
    description: "This will login with your epic games account",
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
                request(token_request, async function (error, response1) {
                  //  console.log(response1.body)
                    const accessToken = JSON.parse(response1.body)['access_token']
                    var auth_request = {
                        "url": `https://friends-public-service-prod.ol.epicgames.com/friends/api/v1/${Data.accountId}/incoming`,
                        "method": "GET",
                        "headers": {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': `bearer ${accessToken}`
                        }
                    }
                    request(auth_request, async function (error, response2) {
                        console.log(response2.body)
                        const NewSec = JSON.parse(response2.body);
                        //const test3 = test2['data']['fortnite']['posts'][0]
                        const test3 = NewSec
                        var array = [];
                        for (const index of test3) {
                            lol = index['accountId']
                            // console.log(lol)
                            array.push("\n" + "•" + lol);
                            //  console.log(array)
                        }
                        console.log(array)
                        interaction.followUp({ content: `${array}` || "You have like no incoming friends"})
                    })
                })
            }
        })
    }
}