'use strict';

define(['app', 'videojs'], function (app) {
    app.register.controller('messagesCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }]);

    app.register.controller('messagesController', ["$state", "$stateParams", "$sce", "$resource",
        "rest", "tokenError", "localStorageService", "$scope",
        "$anchorScroll", "promiseService", "$http", 
        function ($state, $stateParams, $sce, $resource, rest, tokenError, localStorageService, $scope) {
            $scope.user_id = localStorageService.get('user_id');
            $scope.inboxCollection = $resource(":protocol://:url/messages/inbox?page=:page", {
                page: $scope.currentPage,
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            $scope.sentCollection = $resource(":protocol://:url/messages/sent?page=:page", {
                page: $scope.currentPage,
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            $scope.trashCollection = $resource(":protocol://:url/messages/trash?page=:page", {
                page: $scope.currentPage,
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            $scope.clientListCollection = $resource(":protocol://:url/users/professionals/client-list/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            $scope.newMessageResource = $resource(":protocol://:url/messages/compose/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            $scope.replyMessageResource = $resource(":protocol://:url/messages/reply/:id", {
                id: '@id',
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            $scope.deleteMessageResource = $resource(":protocol://:url/messages/delete/:id", {
                id: '@id',
                protocol: $scope.restProtocol,
                url: $scope.restURL
            }, { 
                update: {
                    method: 'PUT'
                }
            });
            $scope.submitMessage = function () {
                $scope.newMessageResource.save($scope.newMessage, function () {
                    $state.go('messages.view', {view: 'inbox'});
                });
            };
            $scope.deleteMessage = function (index, msg) {
                var attrs;
                $scope.list.splice(index, 1);
                msg.view = $scope.view
                $scope.deleteMessageResource.update(msg, function(){

                });
                //$state.go('messages.view', {view: $scope.view});

            };
            $scope.$on('$stateChangeSuccess', function () {
                var success = function (data) {
                        $scope.list = data.results;
                        $scope.totalItems = data.count;
                        if ($stateParams.index) {
                            $scope.detailIndex = $stateParams.index;
                            $scope.detail = $scope.list[$stateParams.index];
                        }
                    },
                    views = {
                        inbox: function () {
                            $scope.inboxCollection.get({}, success);
                        },
                        sent: function () {
                            $scope.sentCollection.get({}, success);
                        },
                        deleted: function () {
                            $scope.trashCollection.get({}, success);
                        },
                        new: function () {
                            $scope.newMessage = {
                                body: '',
                                recipient: $stateParams.recipient || '',
                                subject: ''
                            };
                        }
                    };
                if($stateParams.view) {
                    $scope.view =  $stateParams.view;
                    if ($stateParams.index != undefined && $scope.list) {
                        $scope.detailIndex = $stateParams.index;
                        $scope.detail = $scope.list[$stateParams.index];
                    }
                    else {
                        $scope.detailIndex = -1;
                        $scope.detail = false;
                        //Run View Function
                        views[$scope.view]();
                    }
                }
                else {
                    $state.go('messages.view', {view: 'inbox'});
                }
                $scope.pageChanged = function () {
                    $scope.currentPage = this.currentPage;
                    views[$scope.view]();
                };
            });

            $scope.getClientTypeAhead = function (query) {
                var deferred = $scope.q.defer();
                $scope.clientListCollection.query({
                    search: query
                }, function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            };
        }]);

    app.register.service('promiseService', function ($q, $rootScope) {
        $rootScope.q = $q
    });
});
