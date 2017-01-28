angular.module("tinyurlApp")
    .controller("showUserController", ["$scope","$http","$routeParams", function ($scope, $http, $routeParams) {
        $http.get("/signup/users/" + $routeParams.username)
            .success(function (data) {
                $scope.email = data.email;
                $scope.username = data.username;
                $scope.password = data.password;

            })
    }])
