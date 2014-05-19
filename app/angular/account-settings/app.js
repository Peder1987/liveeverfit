'use strict';

define(['app'], function(app) {

    app.register.controller('account-settingsCtrl', ['$scope', '$resource', '$modal','localStorageService',"rest","tokenError",
    	function($scope, $resource, $modal, localStorageService, tokenError) {
    		
    		Stripe.setPublishableKey("pk_test_xO4m1cYHr0GCBYbSH2GxdXp8");
    		
    		$scope.user_id = localStorageService.get('user_id');
    		
	        $scope.profileResource = $resource(":protocol://:url/users/:id/",{
	            protocol: $scope.restProtocol,
	            url: $scope.restURL,
	            id: $scope.user_id
	        },{update: { method: 'PUT' }});

	        $scope.professionalResource = $resource(":protocol://:url/users/professionals/:id/",{
	            protocol: $scope.restProtocol,
	            url: $scope.restURL,
	            id: $scope.user_id
	        },{update: { method: 'PUT' }});
	        
	        $scope.profile_user = $scope.profileResource.get(function() {console.log($scope.profile_user)},$scope.checkTokenError);


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
					        },
					        id : function () {
					        	return $scope.profile_user.id;
					        },
					        profileResource: function(){
					        	if($scope.profile_user.type == "professional"){
					        		
					        		return $scope.professionalResource
					        	}
					        	return $scope.profileResource 
					        }
				      }
			      
			    });
			    modalInstance.result.then(function (email) {
			    	$scope.profile_user.email = email;
			      
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
	        	
	        	var modalInstance = $modal.open({
			      templateUrl: 'account-settings/modals/addCertification.html',
			      controller : addCertificationCtrl,
			      size: size,
			      resolve: {
					        email: function () {
					          return  $scope.profile_user.email;
					        },
					        profileResource: function(){
					        	if($scope.profile_user.type == "professional"){
					        		
					        		return $scope.professionalResource
					        	}
					        	return $scope.profileResource 
					        },
					        profile_user: function () {
					          return  $scope.profile_user;
					        }
				      }
			      
			    });
			    modalInstance.result.then(function (certs) {
			    	$scope.profile_user.certification_name1 = certs.certification_name1;
					$scope.profile_user.certification_number1 = certs.certification_number1;
					$scope.profile_user.certification_name2 = certs.certification_name2;
					$scope.profile_user.certification_number2 = certs.certification_number2;
			      
			    }, function () {
			    	
			      
			    });
			    
	        };
	        $scope.deleteCertification = function (cert){
	        	console.log(cert)
	        	if(cert == 'certification_name1'){
	        		console.log('cert1')
	        		$scope.profile_user.certification_name1 = '';
	        		$scope.profile_user.certification_number1 = '';
	        	}else{
	        		$scope.profile_user.certification_name2 = '';
	        		$scope.profile_user.certification_number2 = '';
	        		console.log('cert2')
	        	}
	        	var certifications = {
		    		id : $scope.profile_user.id,
		    		certification_name1 : $scope.profile_user.certification_name1,
		    		certification_number1 : $scope.profile_user.certification_number1,
		    		certification_name2 : $scope.profile_user.certification_name2,
		    		certification_number2 : $scope.profile_user.certification_number2,
		    	}
	        	var obj = $scope.professionalResource.update({id:$scope.profile_user.id}, certifications);
			    
	        };
	        $scope.updateProfile = function (){
	        	var resourceType;
				var temp = $scope.profile_user
	        	if($scope.profile_user.type == "professional"){
					        		
					resourceType = $scope.professionalResource;
				}else{
					resourceType = $scope.profileResource;
				}
				//removing image since it isn't required 
				delete temp['img']
	        	var obj = resourceType.update({id:$scope.profile_user.id}, temp);
			    
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

    var emailChangeCtrl = function($scope, $resource, $modalInstance, localStorageService, email, id, profileResource) {
			$scope.email = email;	
			$scope.message = '';
			$scope.ok = function(emailEdit) {
				
				
				var newEmail = {email:emailEdit, id:id}
                var obj = profileResource.update({id:id}, newEmail).$promise.then(
		        function( value ){/*Do something with value*/

            		$modalInstance.close(emailEdit);
		        },
		        function( error ){
		        	$scope.message = error.data;
		        }
		      )
                
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

			$scope.ok = function() {
				console.log('hello');
               
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
    var addCertificationCtrl = function($scope, $resource, $modalInstance, localStorageService, profileResource, profile_user) {
    	$scope.message = '';
    	$scope.certifications = {
    		id : profile_user.id,
    		certification_name1 : profile_user.certification_name1,
    		certification_number1 : profile_user.certification_number1,
    		certification_name2 : profile_user.certification_name2,
    		certification_number2 : profile_user.certification_number2,
    	}
    	
		$scope.ok = function(valid) {
            var obj = profileResource.update({id:$scope.certifications.id}, $scope.certifications);
            $modalInstance.close($scope.certifications);
		}

		$scope.cancel = function () {
			$modalInstance.dismiss();
		};
    };




    //This is Jcrop
    app.register.directive('imgCropped', ['$window',
        function($window) {

            var bounds = {};

            return {
                restrict: 'E',
                replace: true,
                scope: { src:'=', selected:'&' 
            },
            link: function (scope, element, attr){
                scope.$parent.myImg; 
                var clear = function() {
                    if (scope.$parent.myImg) {
                        scope.$parent.myImg.next().remove();
                        scope.$parent.myImg.remove();
                        scope.$parent.myImg = undefined;
                    }
                };

                scope.$watch('src', function (nv) {
                    clear();
                    // console.log('[src]');
                    // console.log(nv);
                    if (!nv) { // newValue
                        return;
                    }
                    element.after('<img style="max-width: 100%;"/>');
                    scope.$parent.myImg = element.next();
                    scope.$parent.myImg.attr('src', nv);
                    $window.jQuery(scope.$parent.myImg).Jcrop({ 
                        trackDocument: true, 
                        onSelect: function(cords) {
                            scope.$apply(function() {
                                cords.bx = bounds.x;
                                cords.by = bounds.y;
                                scope.selected({cords: cords});
                            });
                        }, 
                        aspectRatio: 1.333333333333333333
                    }, 
                    function(){
                        var boundsArr = this.getBounds();
                        bounds.x = boundsArr[0];
                        bounds.y = boundsArr[1];
                    });
                });
                scope.$on('$destroy', clear);
              }
            };

    }]);


    app.register.factory('fileReader', 
        function($q){
            var onLoad = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            };
            var onError = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.result);
                    });
                };
            };
            var onProgress = function (reader, scope) {
                return function (event) {
                    scope.$broadcast(
                        "fileProgress", 
                        { total: event.total,
                            loaded: event.loaded
                        });
                };
            };
            var getReader = function (deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                reader.onprogress = onProgress(reader, scope);
                return reader;
            };
            var readAsDataURL = function (file, scope) {
                var deferred = $q.defer();
                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };
            return { readAsDataUrl: readAsDataURL };
    });


    app.register.directive('fileselect', [
        function(){
            return {
                link: function(scope, element, attributes) {
                    element.bind("change", function(changeEvent) {
                        scope.img = changeEvent.target.files[0];
                        scope.getFile();
                    });
                }
            };
    }]);


    app.register.controller('ProfilePicCtrl', ['$window', '$timeout', '$scope', 'fileReader',
        function($window, $timeout, $scope, fileReader) {

            $scope.getFile = function(){
                $scope.progress = 0;
                fileReader.readAsDataUrl($scope.img, $scope).then(function(result) {
                    $scope.imageSrc = result;
                });
                $timeout(function () {
                  $scope.initJcrop();
                });
            };


            $scope.$on("fileProgress", function(e, progress) {
                $scope.progress = progress.loaded / progress.total;
            });


            $scope.initJcrop = function(){
                // console.log('init jcrop');
                $window.jQuery('img.aj-crop').Jcrop({
                    onSelect: function(){
                        //$scope.$apply();
                        // console.log('onSelect', arguments);
                    }, 
                    onChange: function(){
                        //$scope.$apply();
                        // console.log('onChange', arguments);
                    }, 
                    trackDocument: true, 
                    aspectRatio: 1.333333333333333333
                });
            };

            $scope.cropOpts = {
              ratioW: 1, 
              ratioH: 1
            };
            $scope.selected = function (cords) {
              var scale;

              $scope.picWidth = cords.w;
              $scope.picHeight = cords.h;

              // console.log('scale');
              if ($scope.picWidth > 400) {
                scale = (400 / $scope.picWidth);
                // console.log($scope.picHeight);
                $scope.picHeight *= scale;
                $scope.picWidth *= scale;
                // console.log(scale);
              }

              if ($scope.picHeight > 400) {
                scale = (400 / $scope.picHeight);
                $scope.picHeight *= scale;
                $scope.picWidth *= scale;
                // console.log(scale);
              }

              // console.log('[cords]', $scope.picWidth / $scope.picHeight);
              // console.log(cords);
              $scope.cropped = true;

              var rx = $scope.picWidth / cords.w, 
                    ry = $scope.picHeight / cords.h, 
                    canvas = document.createElement("canvas"), 
                    context = canvas.getContext('2d'), 
                    imageObj = $window.jQuery('img#preview')[0];

              $window.jQuery('img#preview').css({
                width: Math.round(rx * cords.bx) + 'px',
                height: Math.round(ry * cords.by) + 'px',
                marginLeft: '-' + Math.round(rx * cords.x) + 'px',
                marginTop: '-' + Math.round(ry * cords.y) + 'px'
              });

            };

    }]);
	//This is the end of Jcrop


 	
});





