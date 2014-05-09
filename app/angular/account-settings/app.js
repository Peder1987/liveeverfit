'use strict';

define(['app'], function(app) {

    app.register.controller('account-settingsCtrl', ['$scope', 'localStorageService',
    	function($scope, localStorageService) {
    		$scope.user_id = localStorageService.get('user_id');

	        var profile_user = $resource(":protocol://:url/user/:id/",{
	            protocol: $scope.restProtocol,
	            url: $scope.restURL,
	            id: $scope.user_id
	        },{update: { method: 'PUT' }});
    }]);
    
});