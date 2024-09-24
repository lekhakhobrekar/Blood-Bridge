const mongoose = require('mongoose')
//yeh model export hua hai  controller  mein
const oauthUserSchema = new mongoose.Schema({
    user : {type : Object},
}, {timestamps:true})
module.exports = mongoose.model('users2', oauthUserSchema);