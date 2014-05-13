'use strict';

define(['app'], function(app) {

    app.register.controller('account-settingsCtrl', ['$scope', '$resource', '$modal','localStorageService',"rest","tokenError",
    	function($scope, $resource, $modal, localStorageService, tokenError) {
    		
    		Stripe.setPublishableKey("pk_test_xO4m1cYHr0GCBYbSH2GxdXp8");
    		
    		$scope.user_id = localStorageService.get('user_id');
    		
    		
	        var profileResource = $resource(":protocol://:url/users/:id/",{
	            protocol: $scope.restProtocol,
	            url: $scope.restURL,
	            id: $scope.user_id
	        },{update: { method: 'PUT' }});
	        
	        $scope.profile_user = profileResource.get(function() {},$scope.checkTokenError);


	        $scope.passwordChange = function (size){
	        	
	        	var modalInstance = $modal.open({
			      templateUrl: 'account-settings/modals/passwordChange.html',
			      controller : passwordInstanceCtrl,
			      size: size,
			    });
			    modalInstance.result.then(function () {
			      
			    }, function () {
			    	
			      
			    });
	        };
	        $scope.emailChange = function (size){
	        	
	        	var modalInstance = $modal.open({
			      templateUrl: 'account-settings/modals/emailChange.html',
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
			      templateUrl: 'account-settings/modals/photoChange.html',
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


	        $scope.paymentDetail = function (size){
	        	
	        	var modalInstance = $modal.open({
			      templateUrl: 'account-settings/modals/paymentDetail.html',
			      controller : paymentDetailCtrl,
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
	        $scope.addCertification = function (size){
	        	console.log('test')
	        	var modalInstance = $modal.open({
			      templateUrl: 'account-settings/modals/addCertification.html',
			      controller : addCertificationCtrl,
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
	        $scope.deleteCertification = function (size){
	        	console.log('test');
	        	
			    
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
    var paymentDetailCtrl = function($scope, $resource, $modalInstance, localStorageService) {
    		$scope.message = '';
    		$scope.creditcard = {
				name : '',
				number : '',
				cvc : '',
				exp_month : '',
				exp_year : '',
				address_line1 : '',
				address_line2 : '',
				address_city : '',
				address_country : '',
				address_state : '',
				address_zip : '',
    		}
			$scope.ok = function() {
                Stripe.createToken({
                    name: $scope.creditcard.name,
                    number: $scope.creditcard.number,
                    cvc: $scope.creditcard.cvc,
                    exp_month: $scope.creditcard.exp_month,
                    exp_year: $scope.creditcard.exp_year,
                    address_line1: $scope.creditcard.address_line1,
                    address_line2: $scope.creditcard.address_line2,
                    address_city: $scope.creditcard.address_city,
                    address_country: $scope.creditcard.address_country,
                    address_state: $scope.creditcard.address_state,
                    address_zip: $scope.creditcard.address_zip,
                }, function (status, response) {
                	console.log('stripeee');
                	
                	console.log(response);
                	console.log(status);
                    if (response.error) {
                        
                        $scope.message = response.error.message;
                        
                        $scope.$apply()
                    }
                    else {
                    	$scope.message = '';
                    	var stripeToken = response['id'];
                    	console.log(stripeToken);
                        /*$.post('/modify-payment-details/', $.param(paramObj),function (data) {

                    	});*/
                    }
            	});
			}

			$scope.cancel = function () {
				$modalInstance.dismiss();
			};
    };
    var addCertificationCtrl = function($scope, $resource, $modalInstance, localStorageService) {
    	$scope.message = '';
    		
		$scope.ok = function() {
            
		}

		$scope.cancel = function () {
			
		};
    };

 	
});