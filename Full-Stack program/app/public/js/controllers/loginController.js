angular.module("tinyurlApp")
    .controller("loginController", ["$scope","$http","$location", function ($scope,$http,$location) {
        $scope.submit = function () {
            $http.post("/login/user", {
                username: $scope.username,
                password: $scope.password
            }).success(function (user) {

                if(user){
                    $location.path("/user/" + user.username + "/" + user.password);
                }else{
                    var msg = "username cannot match password!";
                    $location.path("/" + msg);
                }

                })
        }
    }])
