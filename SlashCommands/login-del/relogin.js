const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const profileExport = require("../../models/user")
const request = require("request");
const { json } = require("express/lib/response");
module.exports = {
    name: "relogin",
    description: "This will login with your epic games account",
    type: 'CHAT_INPUT',
    options: [{
        name: "auth",
        type: 'STRING',
        description: "Put your authorization code in here",
        required: true,
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
                const auth = interaction.options.getString("auth")
                var auth_request = {
                    "url": "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
                    "method": "POST",
                    "headers": {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='
                    },
                    form: {
                        'grant_type': 'authorization_code',
                        'code': auth,
                    }
                }
                request(auth_request, async function (error, response) {
                 //   console.log(response.body)
                    const refresh_token = JSON.parse(response.body)['refresh_token']
                    const accessToken = JSON.parse(response.body)['access_token']
                    //  console.log(accessToken)
                    const accountId = JSON.parse(response.body)['account_id']
                    const displayName = JSON.parse(response.body)['displayName']
                    const errorMessage = JSON.parse(response.body)['errorMessage']
                    const errorCode = JSON.parse(response.body)['errorCode']
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setURL('https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code')
                                .setLabel('Authorization code')
                                .setStyle('LINK'),
                        );
                    if (errorCode == "errors.com.epicgames.account.oauth.authorization_code_not_for_your_client") {
                        const embed = new MessageEmbed()
                            .setTitle("There was an error!")
                            .setDescription(errorMessage)
                            .setColor("RANDOM")
                            .setFooter({ text: interaction.member.user.username })
                        return interaction.followUp({ embeds: [embed], components: [row] })
                    }
                    if (errorCode == "errors.com.epicgames.account.oauth.authorization_code_not_found") {

                        const embed = new MessageEmbed()
                            .setTitle("There was an error!")
                            .setDescription(errorMessage)
                            .setColor("RANDOM")
                            .setFooter({ text: interaction.member.user.username })
                        return interaction.followUp({ embeds: [embed], components: [row] })
                    }
                    if (displayName == undefined || displayName == "undefined") {
                        return interaction.followUp({ content: `Your username came as undefined` });
                    }


                   // interaction.followUp({ content: `fIRST TEST: ${displayName}` });
                    var device_request = {
                        "url": `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${accountId}/deviceAuth`,
                        "method": "POST",
                        "headers": {
                            'Authorization': `bearer ${accessToken}`
                        },
                    }
                    request(device_request, async function (error, response1) {



                       // console.log(response1.body)
                        const deviceId = JSON.parse(response1.body)['deviceId']
                        const accountId1 = JSON.parse(response1.body)['accountId']
                      //  console.log(deviceId)
                      //  console.log(accountId1)
                        const secret = JSON.parse(response1.body)['secret']
                        // this is a test
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
                                'account_id': accountId1,
                                'device_id': deviceId,
                                'secret': secret
                            },
                        }
                        request(token_request, async function (error, response2) {
                            profileExport.collection.updateOne({ "discord": discordId }, { $set: { "displayName": displayName } }).catch(err => {
                                console.log(err)
                                return interaction.followUp("There was an err")
                            })
                            profileExport.collection.updateOne({ "discord": discordId }, { $set: { "accountId": accountId1 } }).catch(err => {
                                console.log(err)
                                return interaction.followUp("There was an err")
                            })
                            profileExport.collection.updateOne({ "discord": discordId }, { $set: { "devicecode": deviceId } }).catch(err => {
                                console.log(err)
                                return interaction.followUp("There was an err")
                            })
                            profileExport.collection.updateOne({ "discord": discordId }, { $set: { "refresh_token": refresh_token } }).catch(err => {
                                console.log(err)
                                return interaction.followUp("There was an err")
                            })
                            profileExport.collection.updateOne({ "discord": discordId }, { $set: { "secret": secret } }).catch(err => {
                                console.log(err)
                                return interaction.followUp("There was an err")
                            })
                            const embed = new MessageEmbed()
                                .setTitle(`Welcome ${displayName}!`)
                                .setColor("RANDOM")
                            return interaction.followUp({ embeds: [embed] })
                        })
                    })
                })
            }
        })
    }
}