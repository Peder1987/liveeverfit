'use strict';

define(['app'], function(app) {

    app.register.controller('contactCtrl', ['$scope',
    	function($scope) {
    }]);

    app.register.controller('contactCtrl', ['$scope','$state',
        function($scope,$state) {
            $scope.name = "";
            $scope.email = "";
            $scope.message = "";


            $scope.submit = function(valid){
            	if(valid == true){
            		console.log($scope.name);
            		console.log($scope.email);
            		console.log($scope.message);
            		// $state.go('home');
            	}
            };
    }]);
    
});