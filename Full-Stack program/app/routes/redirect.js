var express = require('express');
var router = express.Router();
var path = require('path');
var urlService = require('../services/urlService');
var statusService = require('../services/statusService');


router.get("*", function (req, res) {
    var shortUrl = req.originalUrl.slice(1);

    urlService.getLongUrl(shortUrl,function (url) {
        if(url){
            res.redirect(url.longUrl);
            statusService.logRequest(shortUrl, req);
        }else {
            res.sendFile("404.html", {root: path.join(__dirname,'../public/views/')});
        }
    });
});

module.exports = router;