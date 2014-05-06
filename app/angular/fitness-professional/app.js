// This is really important
// All one has to do to make a new app is clone this app
// Rename the DIR
// rename the demoCtrl just like DIRCtrl
//change the name of demoCtrl in the index.html
// and make a new state
// Last put it in the nav bar 

'use strict';

define(['app'], function(app) {


    app.register.controller('fitness-professionalCtrl', ['$scope', 'restricted', 
    	function($scope) {
            // $scope.restricted();
    }]);



    app.register.controller("testCtrl",["$scope","$resource","rest","tokenError",
        function($scope,$resource,tokenError){

            var snippetCollection =  $resource("http://:url/demo/snippets/",{
                url: $scope.restURL
            });
            var snippetResource = $resource("http://:url/demo/snippets/:id/",{
                url: $scope.restURL,
                id:'@id'
            },{update: { method: 'PUT' }});

            $scope.snippets = snippetCollection.get(function() {},$scope.checkTokenError);

            $scope.save = function(snippet){
                snippetResource.update({id:snippet.id},snippet)
            }

            $scope.add = function() {
                snippetCollection.save($scope.newSnippet, function() {},
                    function(error) {
                    $scope.message = error.data;
                    $scope.checkTokenError();
                });
            }


    }]);
    return app;

    

});