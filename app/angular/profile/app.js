'use strict';

define(['app', 'feed'], function (app) {
    app.register.controller('profileCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }]);
    app.register.controller('profileController', ['$scope', "$stateParams", '$resource', '$modal', '$http', 'localStorageService', 'rest', 'tokenError',
        function ($scope, $stateParams, $resource, $modal, $http, localStorageService, tokenError) {
            angular.extend($scope, {
                user_id: localStorageService.get('user_id'),
                feed: {
                    id: undefined,
                    filter: undefined,
                    show: false
                },
                tabs: [{title: 'feed', filter:''},{title: 'bio', filter:'exempt'},{title: 'texts', filter:'text'}, {title: 'photos', filter:'photo'}, {title: 'videos', filter:'video'}, {title: 'blogs', filter:'blog'}, {title: 'events', filter:'event'}, {title: 'calendar', filter:'exempt'}, {title: 'reach', filter:'exempt'}],
                filter: function(type) {
                    if(type == 'exempt') {
                        angular.extend($scope.feed, {
                            show: false
                        });
                    }
                    else {
                        $scope.feed = {
                            id: $scope.profile_user.id,
                            filter: type?'/'+type+'/list':'',
                            show: true
                        };
                    }
                },
                followToggle: function () {
                    $scope.followResource.update({id: $scope.user_id, user_id: $scope.profile_user.id}, function (data) {
                        angular.extend($scope.profile_user, data);
                    });
                },
                userResource: $resource(":protocol://:url/users/profile/:id/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL,
                    id: "@id"
                }, {update: { method: 'PUT' }}),
                followResource: $resource(":protocol://:url/users/follow/:id/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL,
                    id: "@id"
                }, {update: { method: 'PUT' }}),
                getProfile: function () {
                    $scope.userResource.get({id: $stateParams.view || $scope.user_id}, function (data) {
                        $scope.profile_user = data;
                        $scope.feed = {
                            id: $scope.profile_user.id,
                            filter: $scope.feed.filter,
                            show: $scope.feed.show
                        };
                    }, $scope.checkTokenError);
                }
            });
            //init view
            $scope.$on('$stateChangeSuccess', $scope.getProfile);
        }
    ]);
});