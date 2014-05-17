'use strict';

define(['app', 'videojs'], function (app) {


    app.register.controller('messagesCtrl', ["$sce", "$stateParams", "$resource",  
                                            "rest", "tokenError", "localStorageService", "$scope",
                                            "$anchorScroll", "promiseService", "$http",

        function ($sce, $stateParams, $resource, rest, tokenError, localStorageService, $scope) {

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

            // initialize first view
            $scope.view = 'inbox';
            $scope.list = $scope.inboxCollection.get({}, function (data){
                    $scope.list = data.results;
                });

            $scope.getClientList = function (query) {
                console.log(query)
                var deferred = $scope.q.defer();
                var filtering = {
                    search: query,
                };
                $scope.clientList =  $scope.clientListCollection.query(filtering, function (data) {
                    console.log(data)
                    console.log($scope.clientList);

                    deferred.resolve($scope.clientList);
                    return $scope.clientList;
                });

                /*if ($scope.location.length <= 0) {
                    $scope.location = [];
                }*/
                return deferred.promise;
            };
            $scope.inboxClick = function () {
                
                $scope.view = 'inbox';
                $scope.listView = "false";
                var items = $scope.inboxCollection.get({}, function (data){
                    $scope.list = data.results;
                });

            };
            $scope.outboxClick = function () {
                $scope.view = 'outbox';
                $scope.listView = "false";
                var items = $scope.sentCollection.get({}, function (data){
                    $scope.list = data.results;
                });
            };
            $scope.trashClick = function () {
                $scope.view = 'trash';
                $scope.title = 'trash';
                $scope.listView = "false";
                var items = $scope.trashCollection.get({}, function (data){
                    $scope.list = data.results;
                });
            };
            $scope.newClick = function () {
                $scope.view = 'message';
            };
            $scope.messageOpen = function (data) {
                $scope.listView = "message";
                $scope.msgView = {
                    subject: data.subject,
                    body: data.body,
                    sender: data.sender,
                    recipient: data.recipient,
                }
            };

        }]);

    app.register.service('promiseService', function($q, $rootScope) {

      $rootScope.q = $q
      
    });
});
