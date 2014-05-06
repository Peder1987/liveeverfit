// This is really important
// All one has to do to make a new app is clone this app
// Rename the DIR
// rename the demoCtrl just like DIRCtrl
//change the name of demoCtrl in the index.html
// and make a new state
// Last put it in the nav bar 

'use strict';

define(['app'], function(app) {


    app.register.controller("fitness-professionalCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            var professionalCollection =  $resource("http://:url/users/professionals/",{
                url: $scope.restURL
            });
            var professionalResource = $resource("http://:url/users/professionals/:id/",{
                url: $scope.restURL,
                id:'@id'
            },{update: { method: 'PUT' }});

            $scope.professionals = professionalCollection.get(function() {},$scope.checkTokenError);

            $scope.save = function(professional){
                professionalResource.update({id:professional.id},professional)
            }

            $scope.add = function() {
                professionalCollection.save($scope.newProfessional, function() {},
                    function(error) {
                    $scope.message = error.data;
                    $scope.checkTokenError();
                });
            }


    }]);

    app.register.controller("tagCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            var professionalCollection =  $resource("http://:url/users/professionals/",{
                url: $scope.restURL
            });
            var professionalResource = $resource("http://:url/users/professionals/:id/",{
                url: $scope.restURL,
                id:'@id'
            },{update: { method: 'PUT' }});

            $scope.professionals = professionalCollection.get(function() {},$scope.checkTokenError);

            $scope.save = function(professional){
                professionalResource.update({id:professional.id},professional)
            }

            $scope.add = function() {
                professionalCollection.save($scope.newProfessional, function() {},
                    function(error) {
                    $scope.message = error.data;
                    $scope.checkTokenError();
                });
            }


    }]);
    return app;

    

});