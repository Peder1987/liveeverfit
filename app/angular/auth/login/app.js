'use strict';

define(['app'], function(app) {

	
    app.register.controller('loginCtrl', ["localStorageService","$resource","$scope", "rest", 'restricted',
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
					console.log($scope.authToken);
					localStorageService.add('Authorization', 'Token ' + $scope.authToken.token);
					localStorageService.add('rest_token', $scope.authToken.token);
					localStorageService.add('user_id', $scope.authToken.id);
					localStorageService.add('user_email', $scope.authToken.email);
                    localStorageService.add('user_img', $scope.authToken.img);
                    localStorageService.add('user_type', $scope.authToken.type);
                    $scope.restricted();
                    setTimeout(function() {
                        window.location = "#/";
                    });

				},function(error) {
					$scope.message = error.data;
				});
			}

            $scope.closeAlert = function (error) {
                delete $scope.message[error];
            };
	
	
	}]);


});