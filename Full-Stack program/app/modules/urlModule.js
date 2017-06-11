var mongoose = require('mongoose');
var Schema = mongoose.Schema; /*用来设计表的结构*/

var UrlSchema = new Schema({
    shortUrl : String,
    longUrl : String,
    timestamp : Date,
    username : String,
    remark : String
});

var urlModule = mongoose.model("UrlModule", UrlSchema); /*对数据进行增删改的一个变量 命名为UrlModule*/

module.exports = urlModule;
