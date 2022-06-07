const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const profileExport = require("../../models/user")
const request = require("request");
const { json } = require("express/lib/response");
const fs = require("fs")
const path = require("path")
module.exports = {
    name: "download",
    description: "This will login with your epic games account",
    type: 'CHAT_INPUT',
    options: [{
        name: "choice",
        type: 'STRING',
        description: "What do you want to download!",
        required: true,
        choices: [{
            name: "profile",
            description: "Your account profiles",
            type: 'CHAT_INPUT',
            value: "profile",
        },
        {
            name: "cloudstorage",
            description: "Your account cloudstorage or the list ig",
            type: 'CHAT_INPUT',
            value: "cloudstorage",
        },
        {
            name: "keychain",
            description: "Your account keychains",
            type: 'CHAT_INPUT',
            value: "keychain",
        }]
    },
    {
        name: "profiles",
        type: 'STRING',
        description: "This will only work if you chose profile",
        required: false,
        choices: [{
            name: "athena",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "athena",
        },
        {
            name: "campaign",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "campaign",
        },
        {
            name: "collection_book_people0",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "collection_book_people0",
        },
        {
            name: "collection_book_schematics0",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "collection_book_schematics0",
        },
        {
            name: "collections",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "collections",
        },
        {
            name: "common_core",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "common_core",
        },
        {
            name: "common_public",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "common_public",
        },
        {
            name: "metadata",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "metadata",
        },
        {
            name: "outpost0",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "outpost0",
        },
        {
            name: "theater0",
            description: "returns websocket ping",
            type: 'CHAT_INPUT',
            value: "theater0",
        }]
    },
    {
        name: "id",
        type: 'STRING',
        description: "Id of the file",
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
                interaction.followUp({ content: "Checking if you still have access to your account!" })
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
                    const whattodo = interaction.options.getString('choice')
                    const accessToken = JSON.parse(response1.body)['access_token']
                    if (whattodo == "profile") {

                        const text = interaction.options.getString('profiles')
                        if (text == null || text == "") {
                            return interaction.followUp("You need to choose a profile to do else this wont work!")
                        } else {
                            interaction.editReply({ content: "Grabbing Profile" })

                            var auth_request = {
                                "url": `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${Data.accountId}/client/QueryProfile?profileId=${text}&rvn=-1`,
                                "method": "POST",
                                "headers": {
                                    'Content-Type': 'application/json',
                                    'Authorization': `bearer ${accessToken}`
                                },
                                'body': "{}"
                            }
                            request(auth_request, async function (error, response2) {
                                // console.log(response2.body)
                                interaction.editReply({ content: "Making Profile File" })

                                var alrv3 = JSON.stringify(JSON.parse(response2.body), null, 2);
                                fs.mkdir("./accounts/" + Data.accountId, (err) => {
                                    fs.writeFile(path.join(`accounts/${Data.accountId}/profile.json`), alrv3, 'utf8', (err) => {
                                        if (err) {
                                            console.log(`Error writing file: ${err}`);
                                            interaction.editReply("There was an error")
                                        } else {
                                            return interaction.editReply({ content: `Heres is your ${text} file!`, files: [new MessageAttachment(`./accounts/${Data.accountId}/profile.json`)] })
                                        }
                                    })

                                })
                            })
                        }
                    } else if (whattodo == "cloudstorage") {
                        interaction.editReply({ content: "Grabbing CloudStorage" })
                        const text = interaction.options.getString('id')
                        if (text == null) {
                            var authRequest2 = {
                                'method': 'GET',
                                'url': 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/cloudstorage/system',
                                'headers': {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': `bearer ${accessToken}`
                                },
                            };
                            request(authRequest2, function (error, response1) {
                                var alrv3 = JSON.stringify(JSON.parse(response1.body), null, 2);
                                interaction.editReply({ content: "Making CloudStorage File" })
                                fs.mkdir("./accounts/" + Data.accountId, (err) => {
                                    fs.writeFile(path.join(`accounts/${Data.accountId}/cloudstorage.json`), alrv3, 'utf8', (err) => {
                                        if (err) {
                                            console.log(`Error writing file: ${err}`);
                                            interaction.editReply("There was an error")
                                        } else {
                                            return interaction.editReply({ content: "Might worked idk", files: [new MessageAttachment(`./accounts/${Data.accountId}/cloudstorage.json`)] })
                                        }
                                    })

                                })
                            })
                        } else {
                            var authRequest2 = {
                                'method': 'GET',
                                'url': 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/cloudstorage/system/' + text,
                                'headers': {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': `bearer ${accessToken}`
                                },
                            };
                            request(authRequest2, function (error, response1) {
                                //console.log(response1.body)
                                //const ErrorCode = JSON.parse(response1.body)['errorCode']
                               // if(ErrorCode == "errors.com.epicgames.cloudstorage.file_not_found"){
                               //     return interaction.editReply(JSON.parse(response1.body)['errorMessage'])
                             //   }
                             if(response1.body.includes('errors.com.epicgames.cloudstorage.file_not_found')){
                                 const embed = new MessageEmbed()
                                 .setTitle("Whoops Theres an error")
                                 .setColor("RANDOM")
                                 .setDescription(`${JSON.parse(response1.body)['errorMessage']}\nPlease do /download cloudstorage (without the id)\nThis will grab all the cloudstorages\nit should have a value like "uniqueFilename": "eb54ec8aaea6446f8a960429646fc0b4"\nCopy the part eb54ec8aaea6446f8a960429646fc0b4 then do /download cloudstorage eb54ec8aaea6446f8a960429646fc0b4 then boom you have da file `)
                                return interaction.editReply({ embeds: [embed]})
                             }
                                fs.mkdir("./accounts/" + Data.accountId, (err) => {
                                    fs.writeFile(path.join(`accounts/${Data.accountId}/cloudstorage.ini`), response1.body, 'utf8', (err) => {
                                        if (err) {
                                            console.log(`Error writing file: ${err}`);
                                            interaction.editReply("There was an error")
                                        } else {
                                            return interaction.editReply({ content: "Heres your file!", files: [new MessageAttachment(`./accounts/${Data.accountId}/cloudstorage.ini`)] })
                                        }
                                    })
        
                                })
                            })
                        }
                    } else if (whattodo == "keychain") {
                        interaction.editReply({ content: "Grabbing keychain" })
                        var keychainRequest = {
                            'method': 'GET',
                            'url': 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/storefront/v2/keychain',
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': `bearer ${accessToken}`
                            },
                        };
                        request(keychainRequest, function (error, response1) {
                            var alrv3 = JSON.stringify(JSON.parse(response1.body), null, 2);

                            fs.mkdir("./accounts/" + Data.accountId, (err) => {
                                fs.writeFile(path.join(`accounts/${Data.accountId}/keychain.json`), alrv3, 'utf8', (err) => {
                                    if (err) {
                                        console.log(`Error writing file: ${err}`);
                                        interaction.editReply("There was an error")
                                    } else {
                                        return interaction.editReply({ content: "Heres the keychain", files: [new MessageAttachment(`./accounts/${Data.accountId}/keychain.json`)] })
                                    }
                                })
                            })
                        })
                    } else {
                        return interaction.editReply("Invaild Choice")
                    }
                })
            }
        })
    }
}