'use strict';

define(['app'], function (app) {
    

    app.register.controller('workoutsCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }
    ]);


    app.register.controller("workoutTagCtrl",["$scope","$resource","rest","tokenError",
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

});