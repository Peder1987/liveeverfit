'use strict';

define(['app'], function(app) {

    app.register.controller('logoutCtrl', ['localStorageService','$scope', 
    	function(localStorageService,$scope) {

        localStorageService.remove('Authorization');
        localStorageService.remove('rest_token');
        localStorageService.remove('user_id');
        localStorageService.remove('user_email');
        localStorageService.remove('user_img');
        window.location = "/";

    }]);
    

});