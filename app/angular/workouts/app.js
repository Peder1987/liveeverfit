'use strict';

define(['app',], function (app) {
    

    app.register.controller('workoutsCtrl', ["$scope","$resource",'$location', '$anchorScroll',"rest","tokenError", 
    function($scope,$resource, $location, $anchorScroll, tokenError, tags){
        $scope.difficulty = [];
        $scope.tagSelected = [];
        $scope.search = '';
        
        
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

        $scope.selected = {};

        $scope.difficultyOnClick = function (value) {
            if($scope.difficulty.indexOf(value) == -1){
                $scope.selected[value] = true;
                $scope.difficulty.push(value);
            }
            else{
                var temp = $scope.difficulty.indexOf(value);
                $scope.selected[value] = false;
                $scope.difficulty.splice(temp,1);
            }
            $scope.filter();
        };
        $scope.filter = function () {
            $scope.filtering = {
                difficulty: $scope.difficulty,
                tags : $scope.tagSelected
            };
            //console.log($scope.filtering)
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
            console.log('dib')
   
            /*if($scope.search.indexOf(tag) == -1){
                    $scope.search.push(tag);
                    $scope.tagSelected.push(tag.name);
            }
            else{
                var temp = $scope.search.indexOf(tag);
                $scope.search.splice(temp,1);
                $scope.tagSelected.splice(temp,1);
            }*/
            $scope.filter()

        }




	}]);

    app.register.directive('scrollOnTag', function() {
        return {
            restrict: 'A',
            link: function(scope, $elm, attrs) {
              $elm.on('click', function() {
                var $target;
                //$target = $('#workoutsHeader');
                //$("body").animate({scrollTop: $target.offset().top}, "slow");
              });
            }
        }
    });
        

});