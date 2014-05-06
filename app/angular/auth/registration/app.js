'use strict';

define(['app'], function(app) {

	
        app.register.controller('registrationCtrl', ["localStorageService","$resource","$scope","rest",
    	function(localStorageService, $resource, $scope) {

    		var AuthToken =  $resource("http://:url/accounts/register/", {
                url: $scope.restURL
            });

    		$scope.user = {
				first_name: '',
				last_name: '',
				email: '',
				password: '',
				password2: ''
			};
	
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