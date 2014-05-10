'use strict';

define(['app'], function(app) {

	
        app.register.controller('registrationCtrl', ["localStorageService","$resource","$scope","rest",
    	function(localStorageService, $resource, $scope) {

    		$scope.step = 'choice';

    		$scope.user = {
				first_name: '',
				last_name: '',
				email: '',
				password: '',
				password2: '',
				tier: 1
			};

    		var AuthToken =  $resource("http://:url/accounts/register/", {
                url: $scope.restURL
            });

            var ProAuthToken =  $resource("http://:url/accounts/register-professional/", {
                url: $scope.restURL
            });


			$scope.getCurrentStep = function() {
				return $scope.step;
			};	

			$scope.setCurrentStep = function(step){
				$scope.step = step;
			};

			$scope.setCurrentStepForm = function(step, valid){
				if(valid == true){$scope.step = step;};
			};

			$scope.membership = function(step, tier){
				$scope.user.tier = tier;
				$scope.step = step;
			};

			$scope.professionals = function(step, pro){
				$scope.user.profession = pro;
				$scope.step = step;
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

			$scope.proSubmit = function() {
                // AutoFill Fix
                angular.element(document.getElementsByTagName('input')).checkAndTriggerAutoFillEvent();
				
				$scope.proAuthToken = ProAuthToken.save($scope.user, function() {
					localStorageService.add('Authorization', 'Token ' + $scope.proAuthToken.token);
					localStorageService.add('rest_token', $scope.proAuthToken.token);
					localStorageService.add('user_id', $scope.proAuthToken.id);
					window.location = "/";
				},function(error) {
					$scope.message = error.data;
				});
			}

	
	}]);


});