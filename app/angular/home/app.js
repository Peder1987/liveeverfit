'use strict';

define(['app', 'feed'], function (app) {
    app.register.controller('homeCtrl', ['localStorageService', '$scope', '$resource',
        function (localStorageService, $scope, $resource) {
            angular.extend($scope, {
                token: localStorageService.get('Authorization'),
                tabs: [
                    {title: 'all', filter: '', active: true},
                    {title: 'texts', filter: 'text'},
                    {title: 'photos', filter: 'photo'},
                    {title: 'videos', filter: 'video'},
                    {title: 'blogs', filter: 'blog'},
                    {title: 'events', filter: 'event'}
                ],
                feed: {
                    filter: undefined
                },
                feedFilter: function (type) {
                    $scope.feed = {
                        filter: type ? '/' + type : ''
                    };
                },
                fanaticList: [],
                fanaticCollection : $resource(":protocol://:url/users/fanatics", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                })

            });

            $scope.fanaticCollection.get({}, function(data){
                console.log(data)
                $scope.fanaticList = data.results;

            });

        }]);
    app.register.controller('BannerCtrl', ['$scope',
        function ($scope) {
            var slides = $scope.slides = [
                {
                    image: '/home/img/slider/1.jpg'
                },
                {
                    image: '/home/img/slider/2.jpg'
                },
                {
                    image: '/home/img/slider/3.jpg'
                },
                {
                    image: '/home/img/slider/4.jpg'
                },
                {
                    image: '/home/img/slider/5.jpg'
                }
            ];
        }]);
    return app;
});