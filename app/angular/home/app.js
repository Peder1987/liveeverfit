'use strict';

define(['app'], function(app) {
    app.register.controller('homeCtrl', ['localStorageService','$scope', 
    	function(localStorageService,$scope) {
    		$scope.token = localStorageService.get('Authorization');
            if ($scope.token === null) {
              $scope.homeTemplate = {name: 'loggedout.html', url: 'home/views/loggedout.html'};
            } else {
              $scope.homeTemplate = {name: 'loggedin.html', url: 'home/views/loggedin.html'};
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
            $scope.homeTemplate = {name: 'loggedout.html', url: 'home/views/loggedout.html'};
        } else {
            $scope.homeTemplate = {name: 'loggedin.html', url: 'home/views/loggedin.html'};
        }
        $scope.entrySubmit = function() {
            alert();

        }
    }]);
    app.register.controller('feedController', ['localStorageService','$scope', '$resource', 'rest',
    function(localStorageService,$scope, $resource) {
        $scope.feedList = [];
        $scope.commentInput = '';
        $scope.user_id = localStorageService.get('user_id');
        $scope.user_email = localStorageService.get('user_email');

        $scope.feedCollection = $resource(":protocol://:url/feed", {
            protocol: $scope.restProtocol,
            url: $scope.restURL
        }, {
            update: { method: 'PUT' }
        });
        $scope.commentResource = $resource(":protocol://:url/feed/comment", {
            protocol: $scope.restProtocol,
            url: $scope.restURL
        }, {
            update: { method: 'PUT' }
        });
        //init feed
        $scope.feedCollection.get({}, function(data){
            $scope.feedList = data.results
            console.log($scope.feedList)
        });

        $scope.submitComment = function (obj) {
            var scope = this;
            var commentObj = { 
                text : scope.commentInput,
                user : $scope.user_email,
                entry : obj.id


            }
            $scope.commentResource.save(commentObj, function(data){
                obj.comments.push(data)
            });

        };


    }]);


    return app;
});