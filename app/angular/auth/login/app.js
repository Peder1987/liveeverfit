'use strict';

define(['app'], function(app) {

	
    app.register.controller('loginCtrl', ["localStorageService","$resource","$scope", "rest",
    	function(localStorageService, $resource, $scope) {

    		var AuthToken =  $resource("http://:url/accounts/login", {
                url: $scope.restURL
            });

    		$scope.user = {
				email: '',
				password: ''
			}
	
			$scope.submit = function() {
                // AutoFill Fix
                angular.element(document.getElementsByTagName('input')).checkAndTriggerAutoFillEvent();
				$scope.authToken = AuthToken.save($scope.user, function() {
					localStorageService.add('Authorization', 'Token ' + $scope.authToken.token);
					localStorageService.add('rest_token', $scope.authToken.token);
					localStorageService.add('user_id', $scope.authToken.id);
					window.location = "/";
				},function(error) {
					$scope.message = error.data;
				});
			}
	
	
	}]);


});