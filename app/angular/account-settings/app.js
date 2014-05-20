'use strict';

define(['app'], function(app) {

    app.register.controller('account-settingsCtrl', ['$scope','$resource','$modal','$http','localStorageService','rest','tokenError',
    	function($scope, $resource, $modal, $http,localStorageService, tokenError) {
    		
    		Stripe.setPublishableKey("pk_test_xO4m1cYHr0GCBYbSH2GxdXp8");
    		
    		$scope.user_id = localStorageService.get('user_id');
    		
	        var userResource = $resource(":protocol://:url/users/:id/",{
	            protocol: $scope.restProtocol,
	            url: $scope.restURL,
	            id: $scope.user_id
	        },{update: { method: 'PUT' }});

	        var professionalResource = $resource(":protocol://:url/users/professionals/:id/",{
	            protocol: $scope.restProtocol,
	            url: $scope.restURL,
	            id: $scope.user_id
	        },{update: { method: 'PUT' }});
	        
	        $scope.profile_user = userResource.get(function() {
	        	if($scope.profile_user.type == "professional"){
					$scope.profileResource = userResource
					        
				}else{
					$scope.profileResource = professionalResource
				}

	        },$scope.checkTokenError);


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

					        	return $scope.profileResource 
					        }
				      }
			      
			    });
			    modalInstance.result.then(function (email) {
			    	$scope.profile_user.email = email;
			      
			    }, function () {
			    	
			      
			    });
	        };


	        $scope.photoChange = function(size){
	        	var modalInstance = $modal.open({
	        		templateUrl: 'account-settings/modals/photoChange.html',
	        		controller : 'photoChangeCtrl',
	        		size: size,
	        		resolve: {
	        			id : function(){
	        				return $scope.profile_user.id;
	        			},
	        			email: function () {
	        				return  $scope.profile_user.email;
	        			}
	        		}
	        	});
	        	modalInstance.result.then(function(){
			    },function(){

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
					        },
					        profile_user: function () {
					          return  $scope.profile_user;
					        },
					        profileResource: function(){
					        	return $scope.profileResource 
					        },
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
	        	if(cert == 'certification_name1') {
	        		$scope.profile_user.certification_name1 = '';
	        		$scope.profile_user.certification_number1 = '';
	        	} else {
	        		$scope.profile_user.certification_name2 = '';
	        		$scope.profile_user.certification_number2 = '';
	        	}
	        	var certifications = {
		    		id : $scope.profile_user.id,
		    		certification_name1 : $scope.profile_user.certification_name1,
		    		certification_number1 : $scope.profile_user.certification_number1,
		    		certification_name2 : $scope.profile_user.certification_name2,
		    		certification_number2 : $scope.profile_user.certification_number2,
		    	};
	            $scope.profileResource.update({id:$scope.profile_user.id}, certifications);
			    
	        };
	        $scope.updateProfile = function (){
	        	var resourceType;
				var temp = $scope.profile_user
				//removing image since it isn't required 
				delete temp['img']
				var obj = $scope.profileResource.update({id:$scope.profile_user.id}, temp);
			    
	        };
	        $scope.cancelMembership = function (){
	        	console.log('dib');
			    
	        };
	        $scope.modifyTier = function (){
	        	console.log('dib');
			    
	        };
	        
    }]);


	app.register.controller('photoChangeCtrl', ['$scope','$resource','$modalInstance','$upload','localStorageService','shareImg','email','id',
		function($scope,$resource,$modalInstance,$upload,localStorageService,shareImg,email,id){

			$scope.imgData = {}; 

			$scope.ok = function() {
				console.log('Uploading');
				console.log(shareImg);
				var cords = shareImg.cords.x + ',' + shareImg.cords.y + ',' + shareImg.cords.x2 + ',' + shareImg.cords.y2;
				var WidthHeight = shareImg.cords.bx + ',' + shareImg.cords.by;
				console.log(cords);
				console.log(WidthHeight);

				$scope.upload = $upload.upload({
					url: 'http://localhost:8000/ajax-upload/',
					file: shareImg.imgOrig,
				}).progress(function(evt) {
					console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				}).success(function(data, status, headers, config){
					$scope.imgData =data;
					console.log($scope.imgData.id);

					$scope.upload = $upload.upload({
						url: 'http://localhost:8000/ajax-upload/crop/',
						data: {id: $scope.imgData.id, cropping: cords, WidthHeight: WidthHeight},
					}).progress(function(evt) {
						console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
					}).success(function(data, status, headers, config){
						console.log(data);
					});

				});
				// $modalInstance.dismiss();
			}

			$scope.cancel = function () {
				$modalInstance.dismiss();
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
				password2: ''
			};

            $scope.closeAlert = function (error) {
                delete $scope.message[error];
            };
	
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
            $scope.closeAlert = function (error) {
                delete $scope.message[error];
            };
			$scope.ok = function(emailEdit) {
                profileResource.update({id:id}, {email:emailEdit, id:id}).$promise.then(function() {
            		$modalInstance.close(emailEdit);
		        }, function( error ) {
		        	$scope.message = error.data;
		        })
			};
			$scope.cancel = function () {
				$modalInstance.dismiss();
			};
    };

    var paymentDetailCtrl = function($scope, $resource, $modalInstance, localStorageService, $http, profile_user, profileResource) {
    		$scope.message = '';

    		if(profile_user.creditcard){
	    		$scope.creditcard = {
					name : profile_user.creditcard.name,
					number : profile_user.creditcard.number,
					cvc : profile_user.creditcard.cvc,
					exp_month : profile_user.creditcard.exp_month,
					exp_year : profile_user.creditcard.exp_year,
					address_line1 : profile_user.creditcard.address_line1,
					address_line2 : profile_user.creditcard.address_line2,
					address_city : profile_user.creditcard.address_city,
					address_country : profile_user.creditcard.address_country,
					address_state : profile_user.creditcard.address_state,
					address_zip : profile_user.creditcard.address_zip,
	    		}

    		}else{
    			$scope.creditcard = {
					name : "",
					number : "",
					cvc : "",
					exp_month : "",
					exp_year : "",
					address_line1 : "",
					address_line2 : "",
					address_city : "",
					address_country : "",
					address_state : "",
					address_zip : "",
	    		}
    		}

			$scope.ok = function() {
				var stripeToken;
				var paymentResource = $resource(":protocol://:url/users/modify-payment-details/:id",{
					id : profile_user.id,
		            protocol: $scope.restProtocol,
		            url: $scope.restURL,
		        },{update: { method: 'PUT' }});
				$http.defaults.headers.common['Authorization'] = localStorageService.get('Authorization');
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
                        $scope.$apply()

                    	stripeToken = response['id'];
                    	response = paymentResource.update({id:profile_user.id,stripeToken:stripeToken}, function(){})
                    	$modalInstance.close();
  
                    }
            	});
			};

			$scope.cancel = function () {
				$modalInstance.dismiss();
			};
			$scope.getLocation = function(val) {
				delete $http.defaults.headers.common['Authorization']

				return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
					params: {
				    address: val,
				    sensor: false,
				    components:'country:USA'
					}
				}).then(function(res){
					$scope.addressesInputs = {};
					var addresses = [];
					var types = {};
					angular.forEach(res.data.results, function(item){
						for (var i = 0; i < item.address_components.length; i++) {
                            var addressType = item.address_components[i].types[0];
                            types[addressType] = i;
                        };
						addresses.push(item.formatted_address);
						for (var i = 0; i < item.address_components.length; i++) {
							$scope.addressesInputs[item.formatted_address] = {
								city: (!(types['locality'] === undefined)?item.address_components[types['locality']]['short_name']:!(types['sublocality'] === undefined)?item.address_components[types['sublocality']]['short_name']:!(types['neighborhood'] === undefined)?item.address_components[types['neighborhood']]['short_name'] + ' ':''),
								state: (!(types['administrative_area_level_1'] === undefined)?item.address_components[types['administrative_area_level_1']]['short_name'] + ' ':'')
							};
						};
					});
					return addresses;
				});
				$http.defaults.headers.common['Authorization'] = localStorageService.get('Authorization');
			};
	
			$scope.setAddress = function() {
				if ($scope.tempAddress.formatted_address !== "undefined")
				{
					$scope.address = $scope.addressesInputs[$scope.tempAddress.formatted_address];
					if ($scope.address !== undefined){
						$scope.address.street_line2 = (!($scope.tempAddress.street_line2 === undefined)?$scope.tempAddress.street_line2 + ' ':'');
					}
				}
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
    	};

        $scope.closeAlert = function (error) {
            delete $scope.message[error];
        };
    	
		$scope.ok = function(valid) {
            var obj = profileResource.update({id:$scope.certifications.id}, $scope.certifications);
            $modalInstance.close($scope.certifications);
		}

		$scope.cancel = function () {
			$modalInstance.dismiss();
		};
    };




    //JCrop
    app.register.factory('shareImg', function($rootScope){
    	var data = {};
    	return data;
    });


    app.register.factory('fileReader', function($q){
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
                	'fileProgress', 
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


	app.register.directive('fileselect', function(){
        return {
            link: function(scope, element, attributes) {
                element.bind('change', function(changeEvent) {
                    scope.img = changeEvent.target.files[0];
                    scope.getFile();
                });
            }
        };
    });


    app.register.directive('imgCropped', ['$window','shareImg',
    	function($window,shareImg) {

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
                    if (!nv){
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
                        //Factory Share Image File
                        shareImg.imgOrig = scope.$parent.img;
                    });
                });
                scope.$on('$destroy', clear);
              }
            };
    }]);


    app.register.controller('ProfilePicCtrl', ['$window','$timeout','$scope','fileReader','shareImg',
        function($window, $timeout, $scope, fileReader,shareImg) {

            $scope.getFile = function(){
                $scope.progress = 0;
                fileReader.readAsDataUrl($scope.img, $scope).then(function(result) {
                    $scope.imageSrc = result;
                });
                $timeout(function () {
                  $scope.initJcrop();
                });
            };

            $scope.$on('fileProgress', function(e, progress) {
                $scope.progress = progress.loaded / progress.total;
            });

            $scope.initJcrop = function(){
                $window.jQuery('img.aj-crop').Jcrop({
                    onSelect: function(){
                    }, 
                    onChange: function(){
                    }, 
                    trackDocument: true, 
                    aspectRatio: 1.333333333333333333
                });
            };

            $scope.selected = function(cords){

              var scale;
              shareImg.cords = cords;
              $scope.picWidth = cords.w;
              $scope.picHeight = cords.h;

              if ($scope.picWidth > 400) {
                scale = (400 / $scope.picWidth);
                $scope.picHeight *= scale;
                $scope.picWidth *= scale;
              }
              if ($scope.picHeight > 400) {
                scale = (400 / $scope.picHeight);
                $scope.picHeight *= scale;
                $scope.picWidth *= scale;
              }

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

              $window.jQuery('.canvas-preview').children().remove();
              canvas.width = cords.w;
              canvas.height = cords.h;
              context.drawImage(imageObj, cords.x*2, cords.y*2, cords.w*2, cords.h*2, 0, 0, cords.w, cords.h);
              $window.jQuery('.canvas-preview').append(canvas);

            };

    }]);
	//End JCrop


 	
});





