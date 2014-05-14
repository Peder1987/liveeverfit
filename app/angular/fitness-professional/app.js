'use strict';

define(['app'], function (app) {


    app.register.controller("fitness-professionalCtrl", ["$scope", "$resource", "rest", "tokenError", "specialtyTags",
        function ($scope, $resource, tokenError) {

            $scope.profession = [];
            $scope.professionSelected = {};
            $scope.gender = [];
            $scope.genderSelected = {};
            $scope.location = [];
            $scope.accepting = [];
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
                angular.forEach($scope.professionals.results, function (value, key) {
                    $scope.professionals.results[key].marker = {};
                    $scope.professionals.results[key].marker.coords = {
                        latitude: value.lat,
                        longitude: value.lng,
                    };
                    $scope.professionals.results[key].marker.icon = {
                        url:'fitness-professional/img/marker.png',
                    };
                    $scope.professionals.results[key].marker.show = false;

                });
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

            }
            $scope.loadSpecialty = function () {
                //return $scope.load_specialty()
                var deferred = $scope.q.defer();
                deferred.resolve($scope.tags.results);
                return deferred.promise;

            }

            /*ANYTHING TAG RELATED, kept it in same scope in order make things less complicated*/
            $scope.tagSelected = [];
            $scope.specialtySearch = "";
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
                if ($scope.specialtySearch.indexOf(tag) == -1) {
                    $scope.specialtySearch.push(tag);
                    $scope.tagSelected.push(tag.name);
                }
                else {
                    var temp = $scope.specialtySearch.indexOf(tag);
                    $scope.specialtySearch.splice(temp, 1);
                    $scope.tagSelected.splice(temp, 1);
                }
                $scope.filter()

            }
            $scope.onTagAdd = function (tag) {
                $scope.tagSelected = [];
                $scope.specialtySearch.forEach(function (item) {
                    $scope.tagSelected.push(item.name);
                });

                $scope.filter()

            }
            $scope.onDeleteTag = function (tag) {
                var temp = $scope.tagSelected.indexOf(tag.name);
                $scope.tagSelected.splice(temp, 1);
                $scope.filter()

            }

            //filter function
            $scope.filter = function () {
                $scope.filtering = {
                    profession: $scope.profession,
                    gender: $scope.gender,
                    location: $scope.location,
                    accepting: $scope.accepting,
                    tags: $scope.tagSelected,
                };
                $scope.professionals = filterProfessionalCollection.get($scope.filtering, function () {
                    angular.forEach($scope.professionals.results, function (value, key) {
                        $scope.professionals.results[key].marker = {};
                        $scope.professionals.results[key].marker.coords = {
                            latitude: value.lat,
                            longitude: value.lng,
                        };
                        $scope.professionals.results[key].marker.icon = {
                            url:'fitness-professional/img/marker.png',
                        };
                        $scope.professionals.results[key].marker.show = false;

                    });
                },$scope.checkTokenError);
            };

            //This section is for the google map
            $scope.map = {
                center: {
                    latitude: 30.267153,
                    longitude: -97.743061
                },
                control:{},
                zoom: 5,
            };

            $scope.proFocus = function (professional) {
                $scope.map.control.refresh(professional.marker.coords);
                professional.marker.options = {
                    animation: google.maps.Animation.BOUNCE,
                }
                professional.marker.show = true;
            };
            $scope.proUnfocus = function (professional) {
                $scope.map.control.refresh(professional.marker.coords);
                professional.marker.options = {
                    animation: null,
                }
                professional.marker.show = false;
            };




        }]);

    app.register.service('specialtyTags', function ($q, $rootScope) {
        $rootScope.q = $q
    });

    return app;
});