var app = angular.module("tinyurlApp",["ngRoute", "ngResource", 'chart.js']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/",{
            templateUrl : "./public/views/home.html",
            controller : "homeController"
        })
        .when("/urls/:shortUrl", {
            templateUrl : "./public/views/url.html",
            controller : "urlController"
        })
        .when("/signup",{
            templateUrl : "./public/views/user.html",
            controller : "userController"
        })
        .when("/users/:username", {
            templateUrl : "./public/views/showUser.html",
            controller : "showUserController"
        })
        .when("/login", {
            templateUrl : "./public/views/login.html",
            controller : "loginController"
        })
        .when("/user/:username/:password", {
            templateUrl : "./public/views/userindex.html",
            controller : "userUrlController"
        })
        .when("/:msg", {
            templateUrl : "./public/views/logerror.html",
            controller : "errorController"
        })
});
