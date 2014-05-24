'use strict';

define(['app'], function(app) {

    app.register.controller('logoutCtrl', ['localStorageService','$scope', 
    	function(localStorageService,$scope) {
    		
	        localStorageService.clearAll();
	        window.location = "/";

    }]);
    

});