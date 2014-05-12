'use strict';

define(['app'], function(app) {


	app.register.controller('registrationCtrl', ["localStorageService","$resource","$http","$scope","rest",
		function(localStorageService, $resource, $http, $scope) {

			$scope.step = 'registration';
			$scope.addressesInputs = {};
			$scope.tempAddress = {
				formatted_address:'',
				street_line2:'',
			};
    		$scope.user = {
				first_name: '',
				last_name: '',
				email: '',
				password: '',
				password2: '',
				gender: '',
				tier: 1
			};
			$scope.pro = {
				profession: '',
				education: '',
				experience: '',
				certification_name1: '',
				certification_number1: '',
				certification_name2: '',
				certification_number2: '',
				phone: '',
				twitter: '',
			    facebook: '', 
			    instagram: '', 
			    youtube: '', 
			    linkedin: '',
			    plus: ''
			};
			$scope.address = {
				street_line1: '',
				street_line2: '',
				city: '',
				state: '',
				country: '',
				zipcode: '',
				lat: '',
				lng: ''
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

			$scope.professionals = function(step, tier, pro){
				$scope.pro.profession = pro;
				$scope.user.tier = tier;
				$scope.step = step;
			};
			$scope.preProSubmit = function(){
				angular.forEach($scope.user, function(value, key){
					$scope.pro[key] = value;
					console.log($scope.pro);
				});
				$scope.proSubmit();
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
				
				$scope.proAuthToken = ProAuthToken.save($scope.pro, function() {
					localStorageService.add('Authorization', 'Token ' + $scope.proAuthToken.token);
					localStorageService.add('rest_token', $scope.proAuthToken.token);
					localStorageService.add('user_id', $scope.proAuthToken.id);
					window.location = "/";
				},function(error) {
					$scope.message = error.data;
				});
			}

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
								street_line1: (!(types['street_number'] === undefined)?item.address_components[types['street_number']]['short_name'] + ' ':'') + (!(types['route'] === undefined)?item.address_components[types['route']]['long_name'] + ' ':''),
								city: (!(types['locality'] === undefined)?item.address_components[types['locality']]['short_name']:!(types['sublocality'] === undefined)?item.address_components[types['sublocality']]['short_name']:!(types['neighborhood'] === undefined)?item.address_components[types['neighborhood']]['short_name'] + ' ':''),
								state: (!(types['administrative_area_level_1'] === undefined)?item.address_components[types['administrative_area_level_1']]['short_name'] + ' ':''),
								country: (!(types['country'] === undefined)?item.address_components[types['country']]['long_name'] + ' ':''),
								zipcode: (!(types['postal_code'] === undefined || item.address_components[types['postal_code']] === undefined)?item.address_components[types['postal_code']]['short_name'] + ' ':''),
								lat: item.geometry.location.lat,
								lng: item.geometry.location.lng
							};
						};
					});
					return addresses;
				});
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
	

	}]);


});