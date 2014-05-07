'use strict';

define(['app'], function(app) {


    app.register.controller("fitness-professionalCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            $scope.pro = {
                Trainers: '',
                Nutritionists: ''
            };
            $scope.gender = {
                M: '',
                F: ''
            };
            $scope.ProLocation = '';
            $scope.AcceptingClients = '';
            $scope.Specialties = '';

            var professionalCollection =  $resource("http://:url/users/professionals",{
                url: $scope.restURL
            });

            var filterProfessionalCollection =  $resource("http://:url/users/professionals?:filter",{
                url: $scope.restURL,
                filter:'@filter'
            });

            $scope.professionals = professionalCollection.get(function() {},$scope.checkTokenError);

            $scope.proOnClick = function (value) {
                if($scope.pro[value] == ''){
                    $scope.pro[value] = value;
                }
                else{
                    $scope.pro[value] = ''
                }
                $scope.filter();
            }
            $scope.genderOnClick = function (value) {
                if($scope.gender[value] == ''){
                    $scope.gender[value] = value;
                }
                else{
                    $scope.gender[value] = ''
                }  
                $scope.filter(); 
            }

            $scope.filter = function () {
                console.log('Working');
    
                $scope.proGender = [$scope.gender.M,$scope.gender.F]
                $scope.filtering = {
                    gender: $scope.proGender
                };
                console.log($scope.gender);
                console.log($scope.filtering);

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