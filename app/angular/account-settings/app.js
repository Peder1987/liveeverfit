'use strict';

define(['app'], function(app) {

    app.register.controller('account-settingsCtrl', ['$scope', '$resource','localStorageService',"rest","tokenError",
    	function($scope, $resource, localStorageService, tokenError) {
    		$scope.user_id = localStorageService.get('user_id');

	        var profileResource = $resource(":protocol://:url/users/:id/",{
	            protocol: $scope.restProtocol,
	            url: $scope.restURL,
	            id: $scope.user_id
	        },{update: { method: 'PUT' }});

	        $scope.profile_user = profileResource.get(function() {},$scope.checkTokenError);
    }]);
    
});