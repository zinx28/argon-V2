const mongooes = require('mongoose');

const profileExport = mongooes.Schema({
    "createdAt":{type: Date, require: true},
    "displayName": {type: String, require: true},
    "discord":{type: String, require: true},
    "accountId": {type: String, require: true},
    "devicecode": {type: String, require: true},
    "refresh_token": {type: String, require: true},
    "secret": {type: String, require: true},
})
// String, Number 
// default is what you want it to be by default
const users = mongooes.model("users", profileExport);
module.exports = users