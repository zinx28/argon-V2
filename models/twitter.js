const mongooes = require('mongoose');

const profileExport = mongooes.Schema({
    "appKey": {type: String, require: true},
    "appSecret": {type: String, require: true},
    "accessToken": {type: String, require: true},
    "accessSecret": {type: String, require: true},
    "discord":{type: String, require: true},
})
// String, Number 
// default is what you want it to be by default
const users = mongooes.model("twitter", profileExport);
module.exports = users