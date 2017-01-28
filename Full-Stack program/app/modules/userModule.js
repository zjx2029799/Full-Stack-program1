
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email : String,
    username : String,
    password : String
});



var userModule = mongoose.model("UserModule", UserSchema);

module.exports =userModule;
