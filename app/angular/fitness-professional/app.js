'use strict';

define(['app'], function(app) {


    app.register.controller("fitness-professionalCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            $scope.hello = '';

            var professionalCollection =  $resource("http://:url/users/professionals/",{
                url: $scope.restURL
            });

            $scope.professionals = professionalCollection.get(function() {},$scope.checkTokenError);
            console.log($scope.professionals);

            $scope.filter = function () {
                console.log($scope.hello);
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