'use strict';

define(['app', 'videojs'], function (app) {
    app.register.controller('messagesCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }]);

    app.register.controller('messagesController', ["$stateParams", "$sce", "$resource",
        "rest", "tokenError", "localStorageService", "$scope",
        "$anchorScroll", "promiseService", "$http",
        function ($stateParams, $sce, $resource, rest, tokenError, localStorageService, $scope) {
            $scope.newMessage = {
                body: '',
                recipient: '',
                subject: ''
            }
            $scope.inboxCollection = $resource(":protocol://:url/messages/inbox/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            $scope.sentCollection = $resource(":protocol://:url/messages/sent/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            $scope.trashCollection = $resource(":protocol://:url/messages/trash/", {
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
            // initialize first view
            $scope.view = 'inbox';
            

            $scope.getClientList = function (query) {
                var deferred = $scope.q.defer();
                var filtering = {
                    search: query,
                };
                $scope.clientList =  $scope.clientListCollection.query(filtering, function (data) {
                    deferred.resolve($scope.clientList);
                });
                return deferred.promise;
            };
            $scope.inboxClick = function () {
                
                $scope.view = 'inbox';
                var items = $scope.inboxCollection.get({}, function (data){
                    $scope.list = data.results;
                });

            };
            $scope.outboxClick = function () {
                $scope.view = 'outbox';
                var items = $scope.sentCollection.get({}, function (data){
                    $scope.list = data.results;
                });
            };
            $scope.trashClick = function () {
                $scope.view = 'trash';
                $scope.title = 'trash';
                var items = $scope.trashCollection.get({}, function (data){
                    $scope.list = data.results;
                });
            };
            $scope.newClick = function () {
                $scope.view = 'newMessage';
            };
            $scope.messageOpen = function (data) {
                $scope.msgView = {
                    subject: data.subject,
                    body: data.body,
                    sender: data.sender,
                    recipient: data.recipient,
                }
            };
            $scope.submitMessage = function () {
                console.log($scope.newMessage)
                $scope.newMessageResource.save($scope.newMessage, function (){
                    
                });
                
            };
            

            $scope.$on('$stateChangeSuccess', function () {
                var success = function (data) {
                        $scope.list = data.results;
                        if($stateParams.index) $scope.detail = $scope.list[$stateParams.index];
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
                        new: $.noop
                    };
                $scope.view = $stateParams.view || 'inbox';
                if($stateParams.index && $scope.list) $scope.detail = $scope.list[$stateParams.index];
                else {
                    $scope.detail = false;
                    //Run View Function
                    views[$scope.view]();
                }
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
