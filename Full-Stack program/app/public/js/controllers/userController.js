angular.module("tinyurlApp")
    .controller("userController",["$scope","$http","$location", function ($scope, $http, $location) {
        $scope.submit = function () {
            $http.post("/signup/users", {
                email : $scope.email,
                username : $scope.username,
                password : $scope.password
            }).success(function (data) {

                $location.path("/users/" + data.username);
            });
        }
    }]);
