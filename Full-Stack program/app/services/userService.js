var UserModule = require('../modules/userModule');
var UrlModule = require('../modules/urlModule');

var createUser =  function (email, username, password) {
    var user = new UserModule( {
        email : email,
        username:username,
        password: password
    })
    user.save();

}

var getUser = function (username, callback) {
    UserModule.findOne({username:username}, function (err, user) {

        if(user){
            console.log(user)
            callback({
               email : user.email,
                username: user.username,
                password : user.password
            });
        }
    })
}


var getUserInfo = function (username,callback) {
    UrlModule.find({username:username}, function (err, data) {
       callback(data);
        /*data.forEach(function (urls) {
           callback(urls);
       })*/
    })
}


var getUser3 = function (username,password,callback) {
    UserModule.findOne({
        username: username,
        password: password
    }, function (err, user) {
            callback(user);

    })
}

module.exports = {
    createUser : createUser,
    getUser : getUser,
    getUserInfo : getUserInfo,
    getUser3 : getUser3
};
