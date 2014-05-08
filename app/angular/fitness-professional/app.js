'use strict';

define(['app'], function(app) {


    app.register.controller("fitness-professionalCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            $scope.profession = []
            $scope.gender = []

            var professionalCollection =  $resource("http://:url/users/professionals",{
                url: $scope.restURL
            });

            var filterProfessionalCollection =  $resource("http://:url/users/professionals?:filter",{
                url: $scope.restURL,
                filter:'@filter'
            });

            $scope.professionals = professionalCollection.get(function() {},$scope.checkTokenError);

            $scope.professionOnClick = function (value) {
                if($scope.profession.indexOf(value) == -1){
                    $scope.profession.push(value);
                }
                else{
                    var temp = $scope.profession.indexOf(value);
                    $scope.profession.splice(temp,1);
                }
                $scope.filter();
            }
            $scope.genderOnClick = function (value) {
               if($scope.gender.indexOf(value) == -1){
                    $scope.gender.push(value);
                }
                else{
                    var temp = $scope.gender.indexOf(value);
                    $scope.gender.splice(temp,1);
                }
                $scope.filter();
            }

            $scope.filter = function () {
                $scope.filtering = {
                    profession: $scope.profession,
                    gender: $scope.gender
                };
                console.log($scope.profession);
                console.log($scope.gender);
                $scope.professionals = filterProfessionalCollection.get($scope.filtering, function () {});
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