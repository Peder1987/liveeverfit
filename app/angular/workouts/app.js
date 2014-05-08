'use strict';

define(['app',], function (app) {
    

    app.register.controller('workoutsCtrl', ["$scope","$resource","rest","tokenError",
    function($scope,$resource,tokenError, tags){
        $scope.difficulty = {
                beginner: '',
                intermediate: '',
                advanced: ''
        };

        $scope.search = []

        var videoCollection =  $resource(":protocol://:url/workouts/video/",{
            protocol: $scope.restProtocol,
            url: $scope.restURL
        });
        var videoResource = $resource(":protocol://:url/workouts/video/:id/",{
            protocol: $scope.restProtocol,
            url: $scope.restURL,
            id:'@id'
        },{update: { method: 'PUT' }});
        var filterVideoCollection =  $resource(":protocol://:url/workouts/video?:filter",{
            protocol: $scope.restProtocol,
            filter:'@filter',
            url: $scope.restURL
        });
        $scope.videos = videoCollection.get(function() {},$scope.checkTokenError);



        $scope.difficultyOnClick = function (value) {
            if($scope.difficulty[value] == ''){
                $scope.difficulty[value] = value;
            }
            else{
                $scope.difficulty[value] = ''
            }
            $scope.filter();
        }
        $scope.filter = function () {

            $scope.difficultyArray = [$scope.difficulty.beginner, $scope.difficulty.intermediate, $scope.difficulty.advanced]
            $scope.filtering = {
                difficulty: $scope.difficultyArray
            };
            console.log($scope.difficultyArray);
            console.log($scope.filtering);

            $scope.videos = filterVideoCollection.get($scope.filtering, function () {});

        };

        /*ANYTHING TAG RELATED, kept it in same scope in order make things less complicated*/
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


        $scope.addTag = function(tag) {
            
            // Ensures that no two tags are replicated
            if($scope.search.indexOf(tag) == -1){
                $scope.search.push(tag);
            }

        }




	}]);

    

});