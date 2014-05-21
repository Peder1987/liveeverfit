'use strict';

define(['app'], function(app) {

    app.register.controller('contactCtrl', ['$scope',
    	function($scope) {
    }]);

    app.register.controller('contactCtrl', ['$scope',
        function($scope) {
            $scope.name = "";
            $scope.email = "";
            $scope.message = "";
    }]);
    
});