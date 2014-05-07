'use strict';

define(['app'], function (app) {
    

    app.register.controller('workoutsCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }
    ]);


    app.register.controller("workouts.tagCtrl",["$scope","$resource","rest","tokenError",
    function($scope,$resource,tokenError){

        var tagCollection =  $resource(":protocol://:url/tags/",{
            protocol: $scope.restProtocol,
            url: $scope.restURL
        });
        var tagResource = $resource(":protocol://:url/tags/:id/",{
            protocol: $scope.restProtocol,
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

    app.register.controller("workouts.videoCtrl",["$scope","$resource","rest","tokenError",
    function($scope,$resource,tokenError){

        var videoCollection =  $resource(":protocol://:url/workouts/video/",{
            protocol: $scope.restProtocol,
            url: $scope.restURL
        });
        var videoResource = $resource(":protocol://:url/workouts/video/:id/",{
            protocol: $scope.restProtocol,
            url: $scope.restURL,
            id:'@id'
        },{update: { method: 'PUT' }});

        $scope.videos = videoCollection.get(function() {},$scope.checkTokenError);

        $scope.save = function(professional){
            videoResource.update({id:video.id},video)
        }



    }]);

});