'use strict';

define(['app'], function(app) {


    app.register.controller("fitness-professionalCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            $scope.Trainers = false;
            $scope.Nutritionists = false;
            $scope.pLocation = '';
            $scope.Male = false;
            $scope.Female = false;
            $scope.pAcceptingClients = '';
            $scope.pSpecialties = '';

            var professionalCollection =  $resource("http://:url/users/professionals/",{
                url: $scope.restURL
            });

            $scope.professionals = professionalCollection.get(function() {},$scope.checkTokenError);

            $scope.changeTrainers = function () {
                if ($scope.Trainers == false){
                    $scope.Trainers = true;
                }
                else{
                    $scope.Trainers = false;
                }
                $scope.filter();
            };
            $scope.changeNutritionists = function () {
                if ($scope.Nutritionists == false){
                    $scope.Nutritionists = true;
                }
                else{
                    $scope.Nutritionists = false;
                }
                $scope.filter();
            };
            $scope.changeMale = function () {
                if ($scope.Male == false){
                    $scope.Male = true;
                }
                else{
                    $scope.Male = false;
                }
                $scope.filter();
            };
            $scope.changeFemale = function () {
                if ($scope.Female == false){
                    $scope.Female = true;
                }
                else{
                    $scope.Female = false;
                }
                $scope.filter();
            };
            $scope.filter = function () {
                console.log('Working');
            };


    }]);


    app.register.controller("tagCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            var tagCollection =  $resource("http://:url/tags/",{
                url: $scope.restURL
            });
            var tagResource = $resource("http://:url/tags/:id/",{
                url: $scope.restURL,
                id:'@id'
            },{update: { method: 'PUT' }});

            $scope.tags = tagCollection.get(function() {},$scope.checkTokenError);

            $scope.save = function(professional){
                tagResource.update({id:tag.id},tag)
            }

            $scope.add = function() {
                tagCollection.save($scope.newProfessional, function() {},
                    function(error) {
                    $scope.message = error.data;
                    $scope.checkTokenError();
                });
            }
        
    }]);



    return app;    
});