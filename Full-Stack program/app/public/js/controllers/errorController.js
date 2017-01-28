angular.module("tinyurlApp")
    .controller("errorController", ["$scope","$http","$routeParams", function ($scope,$http,$routeParams) {
        $http.get("/login/" + $routeParams.msg)
            .success(function (msg) {
                $scope.msg = msg.logmsg;
            })
    }])
