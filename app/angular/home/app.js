'use strict';

define(['app'], function(app) {
    app.register.controller('homeCtrl', ['localStorageService','$scope', 
    	function(localStorageService,$scope) {
    		$scope.token = localStorageService.get('Authorization');
            if ($scope.token === null) {
              $scope.homeTemplate = {name: 'loggedout.html', url: 'home/loggedout.html'};
            } else {
              $scope.homeTemplate = {name: 'loggedin.html', url: 'home/loggedin.html'};
            }
    }]);
    app.register.controller('BannerCtrl', ['$scope',
        function($scope) {
            var slides = $scope.slides = [{
                image: '/home/img/slider/1.jpg'
            },{
                image: '/home/img/slider/2.jpg'
            },{
                image: '/home/img/slider/3.jpg'
            },{
                image: '/home/img/slider/4.jpg'
            },{
                image: '/home/img/slider/5.jpg'
            }];
        }]);

    app.register.controller('homeController', ['localStorageService','$scope',
    function(localStorageService,$scope) {
        $scope.token = localStorageService.get('Authorization');
        if ($scope.token === null) {
            $scope.homeTemplate = {name: 'loggedout.html', url: 'home/loggedout.html'};
        } else {
            $scope.homeTemplate = {name: 'loggedin.html', url: 'home/loggedin.html'};
        }
    }]);


    return app;
});