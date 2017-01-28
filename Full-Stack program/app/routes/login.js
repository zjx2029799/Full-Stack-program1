var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var path = require('path');
var userService = require('../services/userService');

router.get("/", function (req, res) {
    res.sendFile("login.html", {root: path.join(__dirname, '../public/views/')});
})

router.post("/user", jsonParser, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    /*getUser3 is matched the username and password*/
   userService.getUser3(username, password, function (user) {

       res.json(user);
   })
});

router.get("/:msg", function (req, res) {
    var logmsg = req.params.msg;
    console.log(logmsg);
    var msg = {
        logmsg: logmsg
    }
    res.json(msg);
})

router.get("/user/:username/:password", function (req,res) {
    var username = req.params.username;
    var password = req.params.password;


    userService.getUserInfo(username, function (data) {
        res.json(data);
    });

})


module.exports = router;