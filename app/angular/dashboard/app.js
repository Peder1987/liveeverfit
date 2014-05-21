'use strict';

define(['app'], function(app) {
    app.register.controller('dashboardCtrl', ['$scope', 'restricted', 
    	function($scope) {
            $scope.restricted();
    }]);
});