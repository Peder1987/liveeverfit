'use strict';

define(['app'], function (app) {


    app.register.controller("fitness-professionalCtrl", ["$scope", "$resource", "rest", "tokenError",
        function ($scope, $resource, tokenError) {

            $scope.profession = [];
            $scope.professionSelected = {};
            $scope.gender = [];
            $scope.genderSelected = {};
            $scope.location = [];
            $scope.accepting = [];
            $scope.tagSelected = [];
            $scope.locations = [];

            var professionalCollection = $resource("http://:url/users/professionals", {
                url: $scope.restURL
            });

            var filterProfessionalCollection = $resource("http://:url/users/professionals?:filter", {
                url: $scope.restURL,
                filter: '@filter'
            });

            var locationlCollection = $resource("http://:url/users/location", {
                url: $scope.restURL
            });

            $scope.professionals = professionalCollection.get(function () {
            }, $scope.checkTokenError);

            $scope.locationsJson = locationlCollection.get(function () {
                $scope.locationsJson.results.forEach(function (entry) {
                    $scope.locations.push(entry.location);
                });
            }, $scope.checkTokenError);



            $scope.professionOnClick = function (value) {
                if ($scope.profession.indexOf(value) == -1) {
                    $scope.profession.push(value);
                    $scope.professionSelected[value] = true;
                }
                else {
                    $scope.profession.splice($scope.profession.indexOf(value), 1);
                    $scope.professionSelected[value] = false;
                }
                $scope.filter();
            };
            $scope.genderOnClick = function (value) {
                if ($scope.gender.indexOf(value) == -1) {
                    $scope.gender.push(value);
                    $scope.genderSelected[value] = true;
                }
                else {
                    $scope.gender.splice($scope.gender.indexOf(value), 1);
                    $scope.genderSelected[value] = false;

                }
                $scope.filter();
            };
            $scope.locationOnChange = function () {
                if ($scope.location.length <= 0) {
                    $scope.location = [];
                }
                $scope.filter();
            };
            var tagCollection = $resource("http://:url/tags/", {
                url: $scope.restURL
            });
            var tagResource = $resource("http://:url/tags/:id/", {
                url: $scope.restURL,
                id: '@id'
            }, {update: { method: 'PUT' }});

            $scope.tags = tagCollection.get(function () {
            }, $scope.checkTokenError);
            $scope.addTag = function (tag) {

                // Ensures that no two tags are replicated

                if ($scope.tagSelected.indexOf(tag) == -1) {
                    $scope.tagSelected.push(tag);
                }
                else {
                    var temp = $scope.tagSelected.indexOf(tag);
                    $scope.tagSelected.splice(temp, 1);
                }
                $scope.filter()

            };
            $scope.filter = function () {
                $scope.filtering = {
                    profession: $scope.profession,
                    gender: $scope.gender,
                    location: $scope.location,
                    accepting: $scope.accepting,
                    tags: $scope.tagSelected,
                };
                $scope.professionals = filterProfessionalCollection.get($scope.filtering, function () {
                });
            };
        }]);
    return app;
});