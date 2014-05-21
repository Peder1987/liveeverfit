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
                image: 'http://placekitten.com/1170/286'
            },{
                image: 'http://placekitten.com/1171/286'
            }];
        }]);
    return app;
});