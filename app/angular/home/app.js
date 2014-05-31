'use strict';

define(['app', 'feed'], function (app) {
    app.register.controller('homeCtrl', ['localStorageService', '$scope',
        function (localStorageService, $scope) {
            angular.extend($scope, {
                token: localStorageService.get('Authorization'),
                tabs: ['text', 'photo', 'video', 'blog', 'event'],
                feed: {
                    filter: undefined
                },
                filter: function(type) {
                    $scope.feed.filter = type;
                    $scope.$apply();
                }
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