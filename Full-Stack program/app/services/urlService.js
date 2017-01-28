var UrlModule = require('../modules/urlModule');
var RequestModules =  require('../modules/requestModule');
var redis = require('redis');
/*process.env是nodejs里用来传环境变量 后面的是两个环境变量(for redis)*/
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;


var redisClient = redis.createClient(port,host);

redisClient.flushall(); /* if you do not have any faults in the last time when you use redis, you do not need to implement this sentence,
    but if you want implement the function of preload cache, you need to think it carefully when to flush it*/


/*not found in mongoose*/


/*delete the expired url modules and request modules*/

/*var delOutDateUrl = function (time) {
    UrlModule.find({},function (err, urls) {
        urls.forEach(function (url) {
            if(url.timestamp.getDate() === time.getDate() && url.timestamp.getMonth() === time.getMonth() && time.getFullYear() - url.timestamp.getFullYear() > 0){
                url.remove();
                RequestModules.remove({shortUrl:url.shortUrl}, function (err) {
                    if(!err){
                        message.type = 'notification!';
                    }else {
                        message.type = 'error';
                    }
                });
            }

        })
    })
};*/


/*for test*/

var delOutDateUrl = function (time) {

    UrlModule.find({},function (err, urls) {
        if(urls){
            urls.forEach(function (url) {
                if(url.timestamp.getMonth() === time.getMonth() && url.timestamp.getFullYear() === time.getFullYear() &&
                    time.getDate() - url.timestamp.getDate()>0){
                    url.remove();
                    RequestModules.remove({shortUrl:url.shortUrl}, function (err) {
                        if(!err){
                            message.type = 'notification!';
                        }else {
                            message.type = 'error';
                        }
                    });
                }
            })
        }
    })
};

/*var time = new Date();
delOutDateUrl(time);*/


var encode = [];

var getCharCode = function (char1, char2) {
    var arr = [];
    var i = char1.charCodeAt(0);
    var j = char2.charCodeAt(0);
    for(;i<=j;i++){
        arr.push(String.fromCharCode(i));
    }
    return arr;
};

encode = encode.concat(getCharCode('A','Z'));
encode = encode.concat(getCharCode('a','z'));
encode = encode.concat(getCharCode('0','9'));

/* 传一个callback function的参数*/            /*how to get username(user) by session ?*/
var getShortUrl = function (longUrl, user, callback) {
    if (longUrl.indexOf('http') === -1) {
        longUrl = "http://" + longUrl;
    }
    redisClient.get(longUrl, function (err, shortUrl) {
        if(shortUrl){
            console.log("call redis");
            callback({
                shortUrl:shortUrl,
                longUrl: longUrl
            });
        }else {
            /* 文档规定这里异步操作callbackd fuction有两个参数*/
            /*有error则返回null，没有error则返回正确数据*/
            UrlModule.findOne({longUrl:longUrl},function (err,data) {
                if(data){ /*如果数据库里有*/
                    console.log(data.timestamp.getDay());
                    callback(data); /*如果找到这个longurl(有结果了)了就执行callbackfunction*/
                    redisClient.set(data.shortUrl,data.longUrl);  /*生成cache通过不同的keys对应不同的值*/
                    redisClient.set(data.longUrl, data.shortUrl);
                }else{ /*数据库没有我们就生成一对*/
                    /*Before generate the new pairs of url, handling the expired url pairs*/
                    var time = new Date();
                    delOutDateUrl(time);
                    generateShortUrl(function (shortUrl) {  /* 没找到就异步执行生成shorturl的方法*/
                        var url = new UrlModule({
                            shortUrl: shortUrl,
                            longUrl : longUrl,
                            timestamp : new Date(),
                            username : user
                        });
                        url.save();

                        callback(url);
                        redisClient.set(shortUrl,longUrl);  /*生成cache通过不同的keys对应不同的值*/
                        redisClient.set(longUrl, shortUrl);
                    });
                }
            }); /*这里先不处理err错误的情况*/
        }
    });

};
var generateShortUrl = function (callback) {

    UrlModule.count({}, function (err, num) {
        var shortUrl = convertTo62(num);
        UrlModule.count({shortUrl:shortUrl}, function (err, snum) {
            if(snum>0){
                shortUrl = shortUrl + snum.toString();
                callback(shortUrl);
            }else {
                callback(shortUrl);
            }
        })
        /*callback(convertTo62(num));*/
    })



};

var convertTo62 = function (num) {
    var result = "";
    do {
        result = encode[num%62] + result;
        num = Math.floor(num/62);
    }while(num)
    return result;
};

var getLongUrl = function (shortUrl, callback) {
    redisClient.get(shortUrl,function (err, longUrl) {
        if(longUrl){
            callback({
                longUrl: longUrl,
                shortUrl: shortUrl
            });
        }else {
            UrlModule.findOne({shortUrl:shortUrl}, function (err, data) {
                /*callback anyway because the method in redirect() can handle this problem*/
                callback(data);
                /*but here we need to make sure data has real value and then to save in the cache, because, if data is null, it will save a pair(favicon, null) in cache thus */
                if(data) {
                    redisClient.set(data.longUrl, data.shortUrl);
                    redisClient.set(data.shortUrl, data.longUrl);
                }
            });
        }
    })
};

/*var delOutDateUrl = function (time) {
    UrlModule.find({},function (err, urls) {
        urls.forEach(function (url) {
            if(url.timestamp.getMonth() === time.getMonth() && time.getFullYear() - url.timestamp.getFullYear() >= 1){
                url.remove();
            }
        })
    })
};*/



module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};