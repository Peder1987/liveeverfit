'use strict';

define(['app', 'feed'], function (app) {
    app.register.controller('homeCtrl', ['localStorageService', '$scope', '$resource', '$state', 'promiseService', 
        function (localStorageService, $scope, $resource, $state) {
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
                fanaticSearch : '',
                fanaticList: [],
                fanaticCollection : $resource(":protocol://:url/users/fanatics", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {'query': {method: 'GET', isArray: false }}),
                fanaticTypeahead : function (query) {
                    var deferred = $scope.q.defer();
                    $scope.fanaticCollection.query({
                        search: query
                    }, function (data) {
                        deferred.resolve(data.results);
                    });
                    return deferred.promise;
                }

            });
            $scope.fanaticCollection.get({}, function(data){
                $scope.fanaticList = data.results;

            });
            $scope.onSelect = function($item, $model, $label){
                console.log($item);
                $state.go('profile.view', {view: $item.id})
            }
            

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
    app.register.service('promiseService', function ($q, $rootScope) {
        $rootScope.q = $q
    });
    return app;
});