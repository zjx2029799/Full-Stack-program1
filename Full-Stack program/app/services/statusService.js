var geoip = require('geoip-lite');
var RequestModule = require("../modules/requestModule");

var logRequest = function (shortUrl,req) {
    var reqInfo ={};
    reqInfo.shortUrl = shortUrl;
    reqInfo.referer = req.headers.referer || "Unknown";    /*在heades里是“referer”*/

    /*要得到 platform 需要 npm的工具 user-agent 所以要install  user-agent 这个包会直接在req里加入这个功能*/

    reqInfo.platform = req.useragent.platform || "Unknown";
    reqInfo.browser = req.useragent.browser || "Unknown"
    var ip = req.headers["x-forward-for"] || req.connection.remoteAddress ||
            req.socket.remotAddress || req.connection.socket.remoteAddress;   /*kinds of ways for getting ip address */

    /*为了得到点击短链接的用户req的国籍 需要google search 另外一个工具 npm 的 geoip-lite*/

    var geoips = geoip.lookup(ip);
    if(geoips){
        reqInfo.country = geoips.country;
    }else {
        reqInfo.country = "Unknown";
    }
    reqInfo.timestamp = new Date();
    var request = new RequestModule(reqInfo);
    request.save();
};

var getUrlInfo = function (shortUrl, info, callback) {
  if(info === "totalClicks"){
      RequestModule.count({shortUrl:shortUrl}, function (err, data) {
          callback(data);
      });
      return;
  }
     /*需要用到mongoDB aggregate功能*/
    var groupId = "";
    if(info === "hour"){
        groupId = {
            year:{$year: "$timestamp"},
            month:{$month:"$timestamp"},
            day:{$dayOfMonth:"$timestamp"},
            hour:{$hour:"$timestamp"},
            minutes:{$minute:"$timestamp"}
        }
    }else if(info === "day"){
        groupId = {
            year:{$year: "$timestamp"},
            month:{$month:"$timestamp"},
            day:{$dayOfMonth:"$timestamp"},
            hour:{$hour:"$timestamp"}
        }
    }else if(info === "month"){
        groupId = {
            year:{$year: "$timestamp"},
            month:{$month:"$timestamp"},
            day:{$dayOfMonth:"$timestamp"}
        }
    }else if(info === "year"){
      groupId = {
          year:{$year:"$timestamp"},
          month:{$month:"$timestamp"}
      }
    } else {
        groupId = "$" + info;
    }

    RequestModule.aggregate([
       {
           $match: {
               shortUrl : shortUrl  /*查所有shortUrl是这个的*/
           }
       },
       {
           $sort: {
               timestamp: -1   /*按照时间戳逆序排序*/
           }
       },
       {
           $group: {
               _id: groupId,
               count: {
                   $sum: 1
               }
           }
       }
   ], function (err, data) {
        callback(data);
       });
};

module.exports = {
   logRequest : logRequest,
    getUrlInfo : getUrlInfo
};
