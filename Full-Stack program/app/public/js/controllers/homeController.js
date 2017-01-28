angular.module("tinyurlApp")
    .controller("homeController",["$scope","$http","$location", function ($scope, $http, $location) {
        $scope.submit = function () {                             /*  $location是由ngRouter提供的变量  */
            $http.post("/api/v1/urls", {
                longUrl : $scope.longUrl
            }).success(function (data) { /* 想看看短链接是XX的url长得什么样所以这样跳转一个新的页面*/
                $location.path("/urls/" + data.shortUrl);
            });
        }
    }]);
