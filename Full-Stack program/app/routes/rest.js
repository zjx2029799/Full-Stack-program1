var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlService = require('../services/urlService');
var statusService = require('../services/statusService');
var userService = require('../services/userService');

router.post("/urls", jsonParser, function (req, res) {
    var longUrl = req.body.longUrl;
   /* var user = "zjx";*/
    var user = req.body.username;
    var remark = req.body.remark;
    urlService.getShortUrl(longUrl, user,remark, function (url) {
        res.json(url);
    });
});



router.get("/urls/:shortUrl", function (req, res) {
    var shortUrl = req.params.shortUrl;
    urlService.getLongUrl(shortUrl, function (url) {
        res.json(url);
    });

});


router.get("/urls/:shortUrl/:info", function (req, res) {

    statusService.getUrlInfo(req.params.shortUrl, req.params.info, function (data) {
        res.json(data);
    })
})
module.exports = router;
