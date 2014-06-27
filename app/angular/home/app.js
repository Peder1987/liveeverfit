'use strict';

var TourDemoCtrl = function ($scope, $tour) {
    $(document).ready(function(){
  $scope.startTour = $tour.start;
  console.log($tour);
  console.log($scope);
});
};

define(['app', 'feed'], function (app) {
    app.register.controller('homeCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }]);
    /*app.register.controller('TourDemoCtrl', ['$scope', 'restricted',
        function ($scope, $tour) {
            console.log($tour);
            console.log($scope);
            $scope.startTour = $tour.start;
        }]);*/
    app.register.controller('homeController', ['localStorageService', '$scope', '$resource', '$state', '$stateParams', 'promiseService',
        function (localStorageService, $scope, $resource, $state, $stateParams) {
            angular.extend($scope, {
                token: localStorageService.get('Authorization'),
                tabs: [
                    {title: 'all', filter: '', active: true},
                    {title: 'statuses', filter: 'text'},
                    {title: 'photos', filter: 'photo'},
                    {title: 'videos', filter: 'video'},
                    {title: 'blogs', filter: 'blog'},
                    {title: 'events', filter: 'event'}
                ],
                initFeed: function() {
                    $scope.feed = {
                        filter: $stateParams.id ? '/entry/' + $stateParams.id : undefined,
                        show: true
                    };
                },
                feed: {
                    filter: undefined,
                    show: false
                },
                feedFilter: function (type) {
                    $scope.feed = {
                        filter: type ? '/' + type : ''
                    };
                },
                
            });
            $scope.$on('$stateChangeSuccess', $scope.initFeed);
            $scope.initFeed();

            $scope.onSelect = function($item, $model, $label){
                $state.go('profile.view', {view: $item.id})
            }
            

        }]);
    app.register.controller('BannerCtrl', ['$scope',
        function ($scope) {
            var slides = $scope.slides = [
                {
                    image: 'home/img/slider/1.jpg'
                },
                {
                    image: 'home/img/slider/2.jpg'
                },
                {
                    image: 'home/img/slider/3.jpg'
                },
                {
                    image: 'home/img/slider/4.jpg'
                },
                {
                    image: 'home/img/slider/5.jpg'
                }
            ];
        }]);
    app.register.service('promiseService', function ($q, $rootScope) {
        $rootScope.q = $q
    });
    return app;
});