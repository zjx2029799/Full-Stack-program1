var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var path = require('path');
var userService = require('../services/userService');

router.get("/", function (req,res) {
    res.sendFile("user.html", {root: path.join(__dirname, '../public/views/')});
});

router.post("/users", jsonParser, function (req, res) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    userService.createUser(email,username, password);
    res.json({
        email : email,
        username : username,
        password : password
    })
});


router.get("/users/:username", function (req,res) {
    var username = req.params.username;
    console.log(username);
    userService.getUser(username, function (user) {
        res.json(user);
    });

})

module.exports = router;
