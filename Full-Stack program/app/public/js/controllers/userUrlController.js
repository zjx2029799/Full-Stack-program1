angular.module("tinyurlApp")
    .controller("userUrlController", ["$scope", "$http", "$location","$routeParams", function ($scope, $http, $location, $routeParams) {
        $scope.submit = function () {                             /*  $location是由ngRouter提供的变量  */
            $http.post("/api/v1/urls", {
                longUrl : $scope.longUrl,
                username : $routeParams.username
            }).success(function (data) { /* 想看看短链接是XX的url长得什么样所以这样跳转一个新的页面*/
                $location.path("/urls/" + data.shortUrl);
            });
        }

        $http.get("/login/user/" + $routeParams.username + "/" +$routeParams.password )
            .success(function (data) {
                /*$scope.username = data.username;*/
                $scope.names = data;
            })
    }])
