'use strict';

define(['app'], function (app) {
    

    app.register.controller('workoutsCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }
    ]);





});