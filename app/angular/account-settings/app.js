'use strict';

define(['app'], function(app) {

    app.register.controller('account-settingsCtrl', ['$scope', '$resource', '$modal','localStorageService',"rest","tokenError",
    	function($scope, $resource, $modal, localStorageService, tokenError) {
    		$scope.user_id = localStorageService.get('user_id');
    		
	        var profileResource = $resource(":protocol://:url/users/:id/",{
	            protocol: $scope.restProtocol,
	            url: $scope.restURL,
	            id: $scope.user_id
	        },{update: { method: 'PUT' }});
	        
	        $scope.profile_user = profileResource.get(function() {},$scope.checkTokenError);


	        $scope.passwordChange = function (size){
	        	
	        	var modalInstance = $modal.open({
			      templateUrl: 'account-settings/passwordChange.html',
			      controller : passwordInstanceCtrl,
			      size: size,
			    });
			    modalInstance.result.then(function () {
			      
			    }, function () {
			    	
			      
			    });
	        };
	        $scope.emailChange = function (size){
	        	
	        	var modalInstance = $modal.open({
			      templateUrl: 'account-settings/emailChange.html',
			      controller : emailChangeCtrl,
			      size: size,
			      resolve: {
					        email: function () {
					          return  $scope.profile_user.email;
					        }
				      }
			      
			    });
			    modalInstance.result.then(function () {
			      
			    }, function () {
			    	
			      
			    });
	        };
	         $scope.photoChange = function (size){
	        	
	        	var modalInstance = $modal.open({
			      templateUrl: 'account-settings/photoChange.html',
			      controller : photoChangeCtrl,
			      size: size,
			      resolve: {
					        email: function () {
					          return  $scope.profile_user.email;
					        }
				      }
			      
			    });
			    modalInstance.result.then(function () {
			      
			    }, function () {
			    	
			      
			    });
	        };

			
    }]);
	
    var passwordInstanceCtrl = function($scope, $resource, $modalInstance, localStorageService) {
    		
    		
			$scope.current_password = '';
			$scope.password1 = '';
			$scope.password2 = '';
			var AuthChange =  $resource(":protocol://:url/accounts/change-password", {
				protocol: $scope.restProtocol,
                url: $scope.restURL
            });

    		$scope.user = {
				token: localStorageService.get('rest_token'),
				current_password: '',
				password: '',
				password2: '',
			}
	
			$scope.ok = function() {
                // AutoFill Fix
                angular.element(document.getElementsByTagName('input')).checkAndTriggerAutoFillEvent();
				$scope.authToken = AuthChange.save($scope.user, function() {
					window.location = "/#/logout";
				},function(error) {
					$scope.message = error.data;
				});
			}

			$scope.cancel = function () {
				$modalInstance.dismiss();
			};
    };

    var emailChangeCtrl = function($scope, $resource, $modalInstance, localStorageService, email) {
    		
    		
			$scope.email = email;
			
			var AuthChange =  $resource("http://:url/accounts/change-password", {
                url: $scope.restURL
            });

    		$scope.user = {
				token: localStorageService.get('rest_token'),
				current_password: '',
				password: '',
				password2: '',
			}
	
			$scope.ok = function() {
                // AutoFill Fix
                angular.element(document.getElementsByTagName('input')).checkAndTriggerAutoFillEvent();
				$scope.authToken = AuthChange.save($scope.user, function() {
					window.location = "/#/logout";
				},function(error) {
					$scope.message = error.data;
				});
			}

			$scope.cancel = function () {
				$modalInstance.dismiss();
			};
    };

   	var photoChangeCtrl = function($scope, $resource, $modalInstance, localStorageService, email) {
    		
    		
			$scope.email = email;
			
			var AuthChange =  $resource("http://:url/accounts/change-password", {
                url: $scope.restURL
            });

    		$scope.user = {
				token: localStorageService.get('rest_token'),
				current_password: '',
				password: '',
				password2: '',
			}
	
			$scope.ok = function() {
                // AutoFill Fix
                angular.element(document.getElementsByTagName('input')).checkAndTriggerAutoFillEvent();
				$scope.authToken = AuthChange.save($scope.user, function() {
					window.location = "/#/logout";
				},function(error) {
					$scope.message = error.data;
				});
			}

			$scope.cancel = function () {
				$modalInstance.dismiss();
			};
    };


 	
});