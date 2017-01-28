var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var mongoose = require('mongoose');
var useragent = require('express-useragent');  /*This package is to log users' platform, browser and other info*/
                                                /*it can be automatically used in http req*/

/*var socketio = require('socket.io');*/


mongoose.connect("mongodb://tinyurl:zjx123@ds053136.mlab.com:53136/tinyurl-zjx"); /*用的时候需要拷贝这一行的连接完成数据库连接mongodb://<dbuser>:<dbpassword>@ds053136.mlab.com:53136/tinyurl-zjx*/

app.use(useragent.express());
/*http请求预处理 把http req的请求经过useragent处理再返回给用户，这样就可以包括（
"browser":"Chrome",
    "version":"17.0.963.79",
    "os":"Windows 7",
    "platform":"Microsoft Windows",
    "source":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79..."
）*/
app.use("/public" , express.static(__dirname + "/public"));
app.use("/node_modules" , express.static(__dirname + "/node_modules"));
app.use("/signup",signupRouter);
app.use("/login", loginRouter)
app.use("/api/v1",restRouter);
app.use("/:shortUrl", redirectRouter);
/*app.use("/:shortUrl",(new redirectRouter(io)).router);*/
app.use("/",indexRouter);

/*var io = socketio(app.listen(3000));*/

app.listen(3000);
