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
                    filter: undefined
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
                connectResource: $resource(":protocol://:url/users/connect/:id/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL,
                    id: "@id"
                }, {update: { method: 'PUT' }}),
                followToggle: function () {
                    $scope.followResource.update({id: $scope.user_id, user_id: $scope.profile_user.id}, function (data) {

                        $scope.profile_user.user_follows = data.user_follows;
                    });
                },
                connect: function () {
                    $scope.connectResource.update({id: $scope.user_id, professional_id: $scope.profile_user.id}, function (data) {
                        $scope.profile_user.user_connected = data.user_connected
                    });
                },
                getProfile: function () {
                    $scope.userResource.get({id: $stateParams.view || $scope.user_id}, function (data) {
                        $scope.profile_user = data;
                    }, $scope.checkTokenError);
                }
            });
            //init view
            $scope.$on('$stateChangeSuccess', $scope.getProfile);
        }
    ]);
});