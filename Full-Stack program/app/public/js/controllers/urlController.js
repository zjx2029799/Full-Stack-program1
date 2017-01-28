angular.module("tinyurlApp")
    .controller("urlController",["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        $http.get("/api/v1/urls/" + $routeParams.shortUrl)
            .success(function (data) { /*注意$scope只是一个普通的变量用来读取html页面里的东西，$http是ngResource里的变量*/
                $scope.shortUrl = data.shortUrl;
                $scope.longUrl = data.longUrl;
                $scope.showShortUrl = "http://localhost:3000/"+data.shortUrl;
            })
        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
            .success(function (data) {
                $scope.totalClicks = data;
            });
        /*因为要拿很多类似的chart数据所以这么写增加代码重用*/
        var renderChart = function (chart, infos) {
            $scope[chart + "Labels"] = [];
            $scope[chart + "Data"] = [];
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
                .success(function (data) {
                    /*console.log(data);*/
                    data.forEach(function (info) {
                        $scope[chart + "Labels"].push(info._id);
                        $scope[chart + "Data"].push(info.count);
                    });
                });
        };

        renderChart("doughnut","referer");
        renderChart("pie", "country");
        renderChart("base", "platform");
        renderChart("bar", "browser");

        $scope.hour = "hour";
        $scope.day = "day";
        $scope.month = "month";
        $scope.year = "year";
        $scope.time = $scope.hour;  /*一进来默认时间显示hour的(initialize)*/


        $scope.getTime = function (time) {
            $scope.lineLabels = [];
            $scope.lineData = [];

            $scope.time = time;  /*当点击后看一下哪一个会变灰*/

            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
                .success(function (data) {
                    data.forEach(function (item){
                        var legend = "";
                        if(time === "hour"){
                            if(item._id.minutes < 10){
                                item._id.minutes = "0" + item._id.minutes;
                            }
                            legend = item._id.hour + ":" +item._id.minutes;
                        }
                        if(time === "day"){
                            legend = item._id.hour + ":00";
                        }
                        if(time === "month"){
                            legend = item._id.month + "/" + item._id.day;
                        }
                        if(time === "year"){
                            legend = item._id.year + "/" + item._id.month;
                        }
                        $scope.lineLabels.push(legend);
                        $scope.lineData.push(item.count);
                    });
                });
        };
        $scope.getTime($scope.time);
    }]);
