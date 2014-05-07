'use strict';

define(['app'], function(app) {


    app.register.controller("fitness-professionalCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            $scope.Trainers = null;
            $scope.Nutritionists = null;
            $scope.ProLocation = null;
            $scope.Male = null;
            $scope.Female = null;
            $scope.AcceptingClients = null;
            $scope.Specialties = null;

            var professionalCollection =  $resource("http://:url/users/professionals/",{
                url: $scope.restURL
            });

            $scope.professionals = professionalCollection.get(function() {},$scope.checkTokenError);

            $scope.changeTrainers = function () {
                if ($scope.Trainers == null){
                    $scope.Trainers = 'Trainers';
                }
                else{
                    $scope.Trainers = null;
                }
                console.log($scope.Trainers);
                $scope.filter();
            };
            $scope.changeNutritionists = function () {
                if ($scope.Nutritionists == null){
                    $scope.Nutritionists = 'Nutritionists';
                }
                else{
                    $scope.Nutritionists = null;
                }
                console.log($scope.Nutritionists);
                $scope.filter();
            };
            $scope.changeMale = function () {
                if ($scope.Male == null){
                    $scope.Male = 'Male';
                }
                else{
                    $scope.Male = null;
                }
                console.log($scope.Male);
                $scope.filter();
            };
            $scope.changeFemale = function () {
                if ($scope.Female == null){
                    $scope.Female = 'Female';
                }
                else{
                    $scope.Female = null;
                }
                console.log($scope.Female);
                $scope.filter();
            };
            $scope.filter = function () {
                console.log('Working');
                $scope.filtering = $scope.Trainers + $scope.Nutritionists + $scope.Male + $scope.Female;
                console.log($scope.filtering);
                // var professionalCollection =  $resource("http://:url/users/professionals/:id/",{
                //     url: $scope.restURL,
                //     id:$scope.filtering

                // });
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