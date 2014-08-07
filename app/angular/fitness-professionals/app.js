'use strict';

define(['app'], function (app) {
    app.register.controller('fitness-professionalsCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }]);
    app.register.controller("fitness-professionalsController", ["localStorageService", "geolocation", "$scope", "$http", "$resource", "rest", "tokenError", "specialtyTags",
        function (localStorageService, geolocation, $scope, $http, $resource) {
            var filterProfessionalCollection = $resource("http://:url/users/professionals?:filter", {
                    url: $scope.restURL,
                    filter: '@filter'
                }),
                locationlCollection = $resource("http://:url/users/location", {
                    url: $scope.restURL
                }),
                tagCollection = $resource("http://:url/all-tags", {
                    url: $scope.restURL
                });
                
            $scope.tagSelected = [];
            $scope.specialtySearch = "";
            $scope.profession = [];
            $scope.professionSelected = {};
            $scope.gender = [];
            $scope.genderSelected = {};
            $scope.location = [];
            $scope.accepting = [];
            $scope.locations = [];
            $scope.page = 1;
            $scope.bigMarkerSize = new google.maps.Size(35, 58);
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
            $scope.findMe = function () {
                $scope.findMeLoading = true;
                geolocation.getLocation().then(function (data) {
                    angular.extend($scope.map, {
                        center: data.coords,
                        zoom: 10
                    });
                    delete $http.defaults.headers.common['Authorization'];
                    $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
                        params: {
                            latlng: data.coords.latitude + ',' + data.coords.longitude,
                            sensor: true
                        }
                    }).then(function (res) {
                        var types = {},
                            city = null,
                            state = null;
                        for (var i = 0; i < res.data.results[0].address_components.length; i++) {
                            types[res.data.results[0].address_components[i].types[0]] = i;
                        }
                        city = (!(types['locality'] === undefined) ? res.data.results[0].address_components[types['locality']]['short_name'] : !(types['sublocality'] === undefined) ? res.data.results[0].address_components[types['sublocality']]['short_name'] : !(types['neighborhood'] === undefined) ? res.data.results[0].address_components[types['neighborhood']]['short_name'] + ' ' : '');
                        state = (!(types['administrative_area_level_1'] === undefined) ? res.data.results[0].address_components[types['administrative_area_level_1']]['short_name'] + ' ' : '').trim();

                        $scope.location = city + ', ' + state;
                        $scope.filter();
                        $scope.findMeLoading = false;
                    });
                    $http.defaults.headers.common['Authorization'] = localStorageService.get('Authorization');
                });
            };
            $scope.loadSpecialty = function (query) {
                var tagTemp, deferred;
                deferred = $scope.q.defer();
                tagTemp = tagCollection.get({search:query}, function(){
                    deferred.resolve(tagTemp.results);
                });  
                return deferred.promise;
            };
            $scope.tags = tagCollection.get($.noop(), $scope.checkTokenError);
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
            };
            $scope.onTagAdd = function (tag) {
                $scope.tagSelected = [];
                $scope.specialtySearch.forEach(function (item) {
                    $scope.tagSelected.push(item.name);
                });
                $scope.filter()
            };
            $scope.onDeleteTag = function (tag) {
                var temp = $scope.tagSelected.indexOf(tag.name);
                $scope.tagSelected.splice(temp, 1);
                $scope.filter()
            };
            //This section is for the google map
            $scope.map = {
                center: {
                    latitude: 38.719805,
                    longitude: -98.613281
                },
                zoom: 4,
                control: {}
            };
            $scope.proMouseOver = function (professional) {
                professional.marker.icon.size = professional.marker.icon.scaledSize = $scope.bigMarkerSize;
                $scope.map.control.refresh(professional.marker.coords);
            };
            $scope.proMouseOut = function (professional) {
                professional.marker.icon.size = professional.marker.icon.scaledSize = null;
                $scope.map.control.refresh(professional.marker.coords);
            };
            //filter function
            $scope.filter = function () {
                $scope.page = 1;
                var filterPros = filterProfessionalCollection.get({
                    profession: $scope.profession,
                    gender: $scope.gender,
                    location: $scope.location,
                    accepting: $scope.accepting,
                    tags: $scope.tagSelected
                }, function () {
                    $scope.professionals = filterPros.results;
                    $scope.next = filterPros.next;
                    angular.forEach($scope.professionals, function (value, key) {
                        var professional = $scope.professionals[key],
                            profession = {
                                "Instructor": '<path fill="rgb(250,250,250)" d="m46.125,10.742676c0,0.089845 0,0.179688 0,0.269043c-1.652344,2.832031 -3.301758,5.666504 -4.919922,8.532715c0.438477,0.479492 0.995117,1.1875 0.768555,2.268066c-0.084961,0.408203 -0.37207,0.769043 -0.614258,1.190918c-1.352539,2.359863 -2.666992,4.57959 -3.99707,6.918457c-0.249023,0.438477 -0.452148,0.877441 -0.730469,1.114258c-0.580078,0.494629 -1.702148,0.76123 -2.576172,0.307617c-0.382813,-0.19873 -0.689453,-0.535645 -0.998047,-0.845215c-0.313477,-0.313477 -0.616211,-0.615723 -0.922852,-0.922363c-0.473633,-0.473145 -1.136719,-1.318359 -1.730469,-1.72998c-0.100586,-0.070801 -0.021484,-0.091309 -0.076172,0.039063c-0.103516,0.247559 0,1.130371 0,1.575684c0,2.84375 0,5.367188 0,8.070801c0,1.147949 0.103516,2.292969 0,3.228516c-0.110352,1.007813 -0.921875,1.955566 -2.037109,2.076172c-0.6875,0.073242 -1.470703,0 -2.19043,0c-1.510742,0 -2.888184,0 -4.42041,0c-0.775879,0 -1.612793,0.088867 -2.152832,-0.07666c-0.655762,-0.20166 -1.262207,-0.808594 -1.498535,-1.499023c-0.200195,-0.585449 -0.115723,-1.585449 -0.115723,-2.537598c0,-4.947754 0,-9.571289 0,-14.451172c0,-0.390625 -0.027832,-0.806152 -0.038086,-1.208008c0,-0.171387 0,-0.342285 0,-0.51416c0.008301,-0.234863 0.030762,-0.45752 0.077148,-0.660645c0.19873,-0.870117 0.925781,-1.556152 1.767578,-1.72998c0.5625,-0.115723 1.327148,-0.038086 2.114258,-0.038086c1.449219,0 2.920898,0 4.304688,0c0.961914,0 2.148438,-0.100098 2.767578,0.153809c0.599609,0.245605 1.081055,0.927246 1.576172,1.421875c1.373047,1.374512 2.649414,2.792969 4.035156,4.035645c0.015625,0.013672 0.089844,0.223633 0.154297,0.07666c0.896484,-1.441406 1.920898,-3.312988 2.84375,-4.919434c0.582031,-1.012695 1.254883,-2.046875 2.84375,-1.691406c1.414063,-2.40625 3.007813,-5.213379 4.458984,-7.763671c0.185547,-0.326172 0.511719,-0.95752 0.768555,-0.999024c0.325195,-0.053223 0.405273,0.103027 0.538086,0.307129z"/><path fill="rgb(250,250,250)" d="m29.597656,11.626465c1.021484,2.390625 0.054688,4.941895 -1.268555,6.265137c-1.336914,1.336914 -3.854492,2.280762 -6.264648,1.268555c-1.729492,-0.726563 -3.371094,-2.391602 -3.535645,-4.842773c-0.133301,-1.97998 0.598145,-3.328125 1.459961,-4.305176c0.921875,-1.042969 2.093262,-1.699707 3.84375,-1.921387c0.294922,0 0.589355,0 0.883789,0c2.39502,0.278809 4.102051,1.711426 4.881348,3.535645z"/>',
                                "Nutritionist": '<path fill="rgb(250,250,250)" d="m17.0715 14.292c1.483-0.643 3.117-0.848 4.722-0.839 1.525 0.047 3.01 0.555 4.323 1.315 1.403 0.856 2.714 1.863 3.895 3.007 1.138-1.113 2.407-2.083 3.757-2.925 1.55-0.932 3.36-1.511 5.183-1.381 1.959 0.051 3.96 0.544 5.567 1.702 1.651 1.165 2.775 2.993 3.187 4.962 0.36401 1.704 0.409 3.506-0.083 5.189 -0.817 2.8-2.73299 5.114-4.80299 7.102 -3.978 3.828-7.952 7.66-11.932 11.489 -0.463 0.473-1.288 0.475-1.752 0.002 -4.377-4.221-8.751-8.443-13.129-12.663 -1.364-1.541-2.658-3.219-3.342-5.184 -0.365-0.979-0.603-2.009-0.632-3.056 -0.005-1.28 0.126-2.576 0.533-3.795 0.686-2.196 2.377-4.047 4.506-4.925l-0.00001 0z"/>',
                                "Trainer": '<path fill="rgb(250,250,250)" d="m29.883789,22.84277c-2.637209,0.040041 -4.61035,-2.753901 -3.442869,-5.375969c0.446779,-0.99951 1.393061,-1.930671 2.876461,-2.122561c1.58301,-0.20117 2.636719,0.38623 3.347658,1.178709c0.49316,0.55225 1.033199,1.638182 0.943359,2.832521c-0.151367,1.953609 -1.791988,3.456049 -3.724609,3.487299z"/><path fill="rgb(250,250,250)" d="m17.1084,21.64893c0.108891,-0.672369 2.18701,-0.84815 2.79443,-0.345709c0.278811,0.22901 0.23535,0.66016 0.2666,1.067389c0.18799,0 0.377451,0 0.56543,0c0.016611,-0.627449 -0.12158,-1.44141 0.37842,-1.745609c0.31934,-0.19385 1.096191,-0.17383 1.366701,0.095209c0.27441,0.270512 0.224609,1.034182 0.224609,1.809582c0,0.738279 0.099609,1.692379 -0.178221,2.057119c-0.3291,0.43799 -1.29492,0.39893 -1.602049,-0.047359c-0.234381,-0.33691 -0.15284,-0.779301 -0.18848,-1.460451c-0.18799,0 -0.331049,-0.001459 -0.519039,-0.001459c0.032709,1.41601 0.064449,3.16357 0.081049,4.67041c0.54981,-0.439461 1.057131,-1.33008 1.56885,-1.841311c0.539061,-0.536621 1.17334,-1.182131 1.76123,-1.52149c0.75635,-0.4375 1.73877,-0.66894 2.86133,-0.553711c1.10644,0.113771 1.866211,1.07666 3.299311,0.944342c1.01123,-0.095221 1.86475,-0.817381 2.780769,-0.944342c0.444332,-0.060059 0.893551,0.0459 1.225582,-0.047359c0.731449,-0.203129 1.211918,-1.175289 1.606449,-1.884279c1.074219,-1.9375 3.223629,-6.44433 3.443359,-6.88525c-0.206059,-0.07471 -0.455082,-0.171881 -0.455082,-0.171881s-0.44141,1.179201 -0.72559,1.30274c-0.544918,0.23877 -1.333981,-0.22266 -1.428707,-0.689939c-0.102543,-0.515141 0.294918,-1.20606 0.580078,-1.855471c0.318359,-0.71387 0.544922,-1.562989 1.12891,-1.64746c0.535149,-0.08301 1.101559,0.240721 1.226559,0.660641c0.181641,0.60108 -0.263668,1.08252 -0.470699,1.55274c0.09277,-0.00586 0.504879,0.266109 0.504879,0.266109s0.369141,-0.72022 0.755863,-0.87891c1.205078,-0.48535 2.720699,0.63282 2.039059,2.02588c0.193359,0.08106 0.380859,0.19141 0.56543,0.284181c0.364262,-0.58594 0.59277,-1.9458 1.791992,-1.31982c0.90918,0.47314 0.223629,1.592771 -0.232422,2.60986c-0.290039,0.651369 -0.49707,1.363279 -1.071289,1.445311c-0.50098,0.06983 -1.042973,-0.25 -1.15234,-0.660151c-0.13282,-0.54151 0.15332,-0.862801 0.365231,-1.414551c-0.147461,-0.074219 -0.3125,-0.15625 -0.453121,-0.283699c-1.711922,3.297859 -3.533211,6.8335 -5.66114,9.855959c-0.48632,0.692381 -0.879879,1.317871 -1.601559,1.744631c0,1.720221 0.03809,4.07959 0.018559,6.287601c-0.018559,1.792969 0.02832,3.354488 0.011711,4.538078c-0.016602,0.939461 0.121098,1.636719 -0.404289,2.118172c-0.298832,0.277828 -0.518562,0.364258 -1.295902,0.379387c-0.80859,0.016121 -5.48975,0.026863 -6.58057,0c-0.382809,-0.01123 -0.823238,-0.16552 -1.099609,-0.464348c-0.2456,-0.265633 -0.362299,-0.784672 -0.337891,-1.562012c0.0459,-1.510258 0.022951,-3.60157 0.022951,-5.069828c0,-1.935551 0.03223,-4.479002 0.03223,-6.414551c-0.103031,-0.011721 -0.301271,0.195799 -0.425291,0.33008c-0.36475,0.39941 -0.746099,0.810549 -1.179199,1.226561c-0.907721,0.876949 -2.417971,2.59375 -3.959961,2.59375c-2.28858,0 -1.984379,-1.963871 -2.106939,-4.057621c-0.096189,-1.627439 -0.092279,-3.27441 -0.186029,-4.668449c-0.16065,0 -0.34766,0.017569 -0.505861,0.017569c-0.030279,0.599131 0.03467,1.142092 -0.23584,1.478521c-0.389159,0.48682 -1.330569,0.54883 -1.61621,-0.129391c-0.12354,-0.282721 -0.1128,-1.071779 -0.1128,-1.822269c0,-0.721189 -0.04394,-1.540041 0.20459,-1.854c0.225101,-0.282721 0.971681,-0.40967 1.417,-0.14307c0.424801,0.259279 0.30615,0.99609 0.32666,1.745609c0.174801,0 0.345699,0 0.522461,0c0.060059,-0.060549 0.016109,-0.533209 0.04785,-0.72168z"/>'
                            },
                            gender = {
                                M: "26,140,255",
                                F: "255,0,102",
                                '': "125,135,144"
                            };
                        professional.marker = {
                            coords: {
                                latitude: value.lat,
                                longitude: value.lng
                            },
                            icon: {
                                url: encodeURI('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 60 100"><path fill="rgb(' + gender[professional.gender] + ')" d="m50.532 9.799c-4.024-4.941-9.865-8.389-16.158-9.428 -1.444-0.252-2.907-0.371-4.37-0.371l-0.008 0c-1.463 0-2.926 0.119-4.37 0.371 -6.293 1.039-12.134 4.486-16.158 9.427 -4.099 4.957-6.345 11.398-6.237 17.828 0.158 2.438 0.861 4.801 1.734 7.07 1.508 5.257 6.578 11.108 6.578 11.108 6.28 6.377 7.42 8.29 9.586 11.821 1.594 2.969 2.752 5.15 4.25 9.875 3.49 11.716 3.72 27.245 4.617 32.451l0 0.049c0.001-0.008-0.001-0.017 0-0.024 0.001 0.008 0 0.017 0 0.024l0-0.049c1-5.20499 1.132-20.73499 4.621-32.451 1.498-4.724 2.658-6.906 4.252-9.875 2.166-3.531 3.307-5.443 9.587-11.82 0 0 5.071-5.852 6.579-11.108 0.873-2.269 1.576-4.631 1.734-7.07 0.108-6.43-2.138-12.871-6.237-17.828z"/>' + profession[professional.profession] + '</svg>')
                            },
                            events: {
                                click: function () {
                                    if ($scope.openedWindow) {
                                        $scope.openedWindow.show = false;
                                    }
                                    $scope.openedWindow = professional.marker.window;
                                    professional.marker.window.show = true;
                                    $scope.$apply();
                                },
                                mouseover: function (marker) {
                                    marker.icon.size = marker.icon.scaledSize = $scope.bigMarkerSize;
                                    $scope.$apply();
                                },
                                mouseout: function (marker) {
                                    marker.icon.size = marker.icon.scaledSize = null;
                                    $scope.$apply();
                                }
                            },
                            window: {
                                show: false,
                                options: {
                                    boxClass: 'custom-info-window',
                                    closeBoxURL: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="21" height="21" viewBox="0 0 450 450" xml:space="preserve"><path fill="#1A8CFF" d="M107.1 39c10.3-3.4 22.6-1.2 30.4 6.6 28.4 28.3 56.7 56.7 85 85 2.5 2.5 4.8 5.2 7.6 7.3 3.4-2.5 5.9-6 8.9-8.9 25.5-25.5 51-51 76.5-76.5 4.2-4.2 8.3-8.6 13.5-11.5 6.3-3.5 13.9-4 20.9-2.8 6.9 1.4 12.6 5.8 17.3 10.7 13.3 13.4 26.8 26.6 39.9 40.1 9 9 10.9 24 4.9 35.1 -3.5 6.2-9 11-14 16 -25.2 25.2-50.3 50.3-75.5 75.5 -2.4 2.4-5 4.6-7 7.4 0.6 0.9 1.3 1.7 2 2.4 27.9 27.8 55.7 55.7 83.5 83.5 5.4 5.4 11.3 11 13.3 18.6 1.9 7.4 1.5 15.7-2.2 22.5 -2.6 4.8-6.6 8.7-10.5 12.6 -12.7 12.6-25.2 25.5-38.1 37.9 -11.1 10.8-30.8 10.6-41.4-0.7 -28.2-28.1-56.3-56.3-84.5-84.4 -2.5-2.4-4.7-5.1-7.5-7.1 -2.4 1.9-4.4 4.2-6.6 6.3 -26.6 26.7-53.3 53.3-80 80 -5.2 5.3-10.8 10.8-18.2 12.8 -7.6 1.9-16.2 1.4-23.1-2.6 -3.7-2.1-6.8-5.2-9.8-8.2 -13.3-13.4-26.7-26.6-39.9-40 -10.7-10.9-10.7-30.2 0.1-41 28.3-28.4 56.7-56.6 85-85 2.5-2.5 5.2-4.8 7.3-7.6 -0.6-1-1.4-1.8-2.2-2.6 -29.2-29.1-58.3-58.3-87.6-87.5 -4.4-4.2-8.2-9.3-9.6-15.3 -1.6-7-1.3-14.6 2.1-21 2.7-5.4 7.1-9.6 11.3-13.8 11.5-11.5 23-23 34.5-34.5C97.2 44.4 101.7 40.8 107.1 39z"/></svg>',
                                    closeBoxMargin: '3px'
                                }
                            }
                        };
                        if(professional.profession == "Instructor")console.log('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 60 100"><path fill="rgb(' + gender[professional.gender] + ')" d="m50.532 9.799c-4.024-4.941-9.865-8.389-16.158-9.428 -1.444-0.252-2.907-0.371-4.37-0.371l-0.008 0c-1.463 0-2.926 0.119-4.37 0.371 -6.293 1.039-12.134 4.486-16.158 9.427 -4.099 4.957-6.345 11.398-6.237 17.828 0.158 2.438 0.861 4.801 1.734 7.07 1.508 5.257 6.578 11.108 6.578 11.108 6.28 6.377 7.42 8.29 9.586 11.821 1.594 2.969 2.752 5.15 4.25 9.875 3.49 11.716 3.72 27.245 4.617 32.451l0 0.049c0.001-0.008-0.001-0.017 0-0.024 0.001 0.008 0 0.017 0 0.024l0-0.049c1-5.20499 1.132-20.73499 4.621-32.451 1.498-4.724 2.658-6.906 4.252-9.875 2.166-3.531 3.307-5.443 9.587-11.82 0 0 5.071-5.852 6.579-11.108 0.873-2.269 1.576-4.631 1.734-7.07 0.108-6.43-2.138-12.871-6.237-17.828z"/>' + profession[professional.profession] + '</svg>');
                    });
                }, $scope.checkTokenError);
            };
            $scope.filter();
            //Pagination
            $scope.getPros = function () {
                $scope.page = $scope.page + 1;
                var newPros = filterProfessionalCollection.get({
                    profession: $scope.profession,
                    gender: $scope.gender,
                    location: $scope.location,
                    accepting: $scope.accepting,
                    tags: $scope.tagSelected,
                    page: $scope.page
                }, function () {
                    $scope.professionals = $scope.professionals.concat(newPros.results);
                    $scope.next = newPros.next;
                    angular.forEach($scope.professionals, function (value, key) {
                        var professional = $scope.professionals[key],
                            profession = {
                                "Instructor": '<path fill="rgb(250,250,250)" d="m46.125,10.742676c0,0.089845 0,0.179688 0,0.269043c-1.652344,2.832031 -3.301758,5.666504 -4.919922,8.532715c0.438477,0.479492 0.995117,1.1875 0.768555,2.268066c-0.084961,0.408203 -0.37207,0.769043 -0.614258,1.190918c-1.352539,2.359863 -2.666992,4.57959 -3.99707,6.918457c-0.249023,0.438477 -0.452148,0.877441 -0.730469,1.114258c-0.580078,0.494629 -1.702148,0.76123 -2.576172,0.307617c-0.382813,-0.19873 -0.689453,-0.535645 -0.998047,-0.845215c-0.313477,-0.313477 -0.616211,-0.615723 -0.922852,-0.922363c-0.473633,-0.473145 -1.136719,-1.318359 -1.730469,-1.72998c-0.100586,-0.070801 -0.021484,-0.091309 -0.076172,0.039063c-0.103516,0.247559 0,1.130371 0,1.575684c0,2.84375 0,5.367188 0,8.070801c0,1.147949 0.103516,2.292969 0,3.228516c-0.110352,1.007813 -0.921875,1.955566 -2.037109,2.076172c-0.6875,0.073242 -1.470703,0 -2.19043,0c-1.510742,0 -2.888184,0 -4.42041,0c-0.775879,0 -1.612793,0.088867 -2.152832,-0.07666c-0.655762,-0.20166 -1.262207,-0.808594 -1.498535,-1.499023c-0.200195,-0.585449 -0.115723,-1.585449 -0.115723,-2.537598c0,-4.947754 0,-9.571289 0,-14.451172c0,-0.390625 -0.027832,-0.806152 -0.038086,-1.208008c0,-0.171387 0,-0.342285 0,-0.51416c0.008301,-0.234863 0.030762,-0.45752 0.077148,-0.660645c0.19873,-0.870117 0.925781,-1.556152 1.767578,-1.72998c0.5625,-0.115723 1.327148,-0.038086 2.114258,-0.038086c1.449219,0 2.920898,0 4.304688,0c0.961914,0 2.148438,-0.100098 2.767578,0.153809c0.599609,0.245605 1.081055,0.927246 1.576172,1.421875c1.373047,1.374512 2.649414,2.792969 4.035156,4.035645c0.015625,0.013672 0.089844,0.223633 0.154297,0.07666c0.896484,-1.441406 1.920898,-3.312988 2.84375,-4.919434c0.582031,-1.012695 1.254883,-2.046875 2.84375,-1.691406c1.414063,-2.40625 3.007813,-5.213379 4.458984,-7.763671c0.185547,-0.326172 0.511719,-0.95752 0.768555,-0.999024c0.325195,-0.053223 0.405273,0.103027 0.538086,0.307129z"/><path fill="rgb(250,250,250)" d="m29.597656,11.626465c1.021484,2.390625 0.054688,4.941895 -1.268555,6.265137c-1.336914,1.336914 -3.854492,2.280762 -6.264648,1.268555c-1.729492,-0.726563 -3.371094,-2.391602 -3.535645,-4.842773c-0.133301,-1.97998 0.598145,-3.328125 1.459961,-4.305176c0.921875,-1.042969 2.093262,-1.699707 3.84375,-1.921387c0.294922,0 0.589355,0 0.883789,0c2.39502,0.278809 4.102051,1.711426 4.881348,3.535645z"/>',
                                "Nutritionist": '<path fill="rgb(250,250,250)" d="m17.0715 14.292c1.483-0.643 3.117-0.848 4.722-0.839 1.525 0.047 3.01 0.555 4.323 1.315 1.403 0.856 2.714 1.863 3.895 3.007 1.138-1.113 2.407-2.083 3.757-2.925 1.55-0.932 3.36-1.511 5.183-1.381 1.959 0.051 3.96 0.544 5.567 1.702 1.651 1.165 2.775 2.993 3.187 4.962 0.36401 1.704 0.409 3.506-0.083 5.189 -0.817 2.8-2.73299 5.114-4.80299 7.102 -3.978 3.828-7.952 7.66-11.932 11.489 -0.463 0.473-1.288 0.475-1.752 0.002 -4.377-4.221-8.751-8.443-13.129-12.663 -1.364-1.541-2.658-3.219-3.342-5.184 -0.365-0.979-0.603-2.009-0.632-3.056 -0.005-1.28 0.126-2.576 0.533-3.795 0.686-2.196 2.377-4.047 4.506-4.925l-0.00001 0z"/>',
                                "Trainer": '<path fill="rgb(250,250,250)" d="m29.883789,22.84277c-2.637209,0.040041 -4.61035,-2.753901 -3.442869,-5.375969c0.446779,-0.99951 1.393061,-1.930671 2.876461,-2.122561c1.58301,-0.20117 2.636719,0.38623 3.347658,1.178709c0.49316,0.55225 1.033199,1.638182 0.943359,2.832521c-0.151367,1.953609 -1.791988,3.456049 -3.724609,3.487299z"/><path fill="rgb(250,250,250)" d="m17.1084,21.64893c0.108891,-0.672369 2.18701,-0.84815 2.79443,-0.345709c0.278811,0.22901 0.23535,0.66016 0.2666,1.067389c0.18799,0 0.377451,0 0.56543,0c0.016611,-0.627449 -0.12158,-1.44141 0.37842,-1.745609c0.31934,-0.19385 1.096191,-0.17383 1.366701,0.095209c0.27441,0.270512 0.224609,1.034182 0.224609,1.809582c0,0.738279 0.099609,1.692379 -0.178221,2.057119c-0.3291,0.43799 -1.29492,0.39893 -1.602049,-0.047359c-0.234381,-0.33691 -0.15284,-0.779301 -0.18848,-1.460451c-0.18799,0 -0.331049,-0.001459 -0.519039,-0.001459c0.032709,1.41601 0.064449,3.16357 0.081049,4.67041c0.54981,-0.439461 1.057131,-1.33008 1.56885,-1.841311c0.539061,-0.536621 1.17334,-1.182131 1.76123,-1.52149c0.75635,-0.4375 1.73877,-0.66894 2.86133,-0.553711c1.10644,0.113771 1.866211,1.07666 3.299311,0.944342c1.01123,-0.095221 1.86475,-0.817381 2.780769,-0.944342c0.444332,-0.060059 0.893551,0.0459 1.225582,-0.047359c0.731449,-0.203129 1.211918,-1.175289 1.606449,-1.884279c1.074219,-1.9375 3.223629,-6.44433 3.443359,-6.88525c-0.206059,-0.07471 -0.455082,-0.171881 -0.455082,-0.171881s-0.44141,1.179201 -0.72559,1.30274c-0.544918,0.23877 -1.333981,-0.22266 -1.428707,-0.689939c-0.102543,-0.515141 0.294918,-1.20606 0.580078,-1.855471c0.318359,-0.71387 0.544922,-1.562989 1.12891,-1.64746c0.535149,-0.08301 1.101559,0.240721 1.226559,0.660641c0.181641,0.60108 -0.263668,1.08252 -0.470699,1.55274c0.09277,-0.00586 0.504879,0.266109 0.504879,0.266109s0.369141,-0.72022 0.755863,-0.87891c1.205078,-0.48535 2.720699,0.63282 2.039059,2.02588c0.193359,0.08106 0.380859,0.19141 0.56543,0.284181c0.364262,-0.58594 0.59277,-1.9458 1.791992,-1.31982c0.90918,0.47314 0.223629,1.592771 -0.232422,2.60986c-0.290039,0.651369 -0.49707,1.363279 -1.071289,1.445311c-0.50098,0.06983 -1.042973,-0.25 -1.15234,-0.660151c-0.13282,-0.54151 0.15332,-0.862801 0.365231,-1.414551c-0.147461,-0.074219 -0.3125,-0.15625 -0.453121,-0.283699c-1.711922,3.297859 -3.533211,6.8335 -5.66114,9.855959c-0.48632,0.692381 -0.879879,1.317871 -1.601559,1.744631c0,1.720221 0.03809,4.07959 0.018559,6.287601c-0.018559,1.792969 0.02832,3.354488 0.011711,4.538078c-0.016602,0.939461 0.121098,1.636719 -0.404289,2.118172c-0.298832,0.277828 -0.518562,0.364258 -1.295902,0.379387c-0.80859,0.016121 -5.48975,0.026863 -6.58057,0c-0.382809,-0.01123 -0.823238,-0.16552 -1.099609,-0.464348c-0.2456,-0.265633 -0.362299,-0.784672 -0.337891,-1.562012c0.0459,-1.510258 0.022951,-3.60157 0.022951,-5.069828c0,-1.935551 0.03223,-4.479002 0.03223,-6.414551c-0.103031,-0.011721 -0.301271,0.195799 -0.425291,0.33008c-0.36475,0.39941 -0.746099,0.810549 -1.179199,1.226561c-0.907721,0.876949 -2.417971,2.59375 -3.959961,2.59375c-2.28858,0 -1.984379,-1.963871 -2.106939,-4.057621c-0.096189,-1.627439 -0.092279,-3.27441 -0.186029,-4.668449c-0.16065,0 -0.34766,0.017569 -0.505861,0.017569c-0.030279,0.599131 0.03467,1.142092 -0.23584,1.478521c-0.389159,0.48682 -1.330569,0.54883 -1.61621,-0.129391c-0.12354,-0.282721 -0.1128,-1.071779 -0.1128,-1.822269c0,-0.721189 -0.04394,-1.540041 0.20459,-1.854c0.225101,-0.282721 0.971681,-0.40967 1.417,-0.14307c0.424801,0.259279 0.30615,0.99609 0.32666,1.745609c0.174801,0 0.345699,0 0.522461,0c0.060059,-0.060549 0.016109,-0.533209 0.04785,-0.72168z"/>'
                            },
                            gender = {
                                M: "26,140,255",
                                F: "255,0,102",
                                '': "125,135,144"
                            };
                        professional.marker = {
                            coords: {
                                latitude: value.lat,
                                longitude: value.lng
                            },
                            icon: {
                                url: encodeURI('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 60 100"><path fill="rgb(' + gender[professional.gender] + ')" d="m50.532 9.799c-4.024-4.941-9.865-8.389-16.158-9.428 -1.444-0.252-2.907-0.371-4.37-0.371l-0.008 0c-1.463 0-2.926 0.119-4.37 0.371 -6.293 1.039-12.134 4.486-16.158 9.427 -4.099 4.957-6.345 11.398-6.237 17.828 0.158 2.438 0.861 4.801 1.734 7.07 1.508 5.257 6.578 11.108 6.578 11.108 6.28 6.377 7.42 8.29 9.586 11.821 1.594 2.969 2.752 5.15 4.25 9.875 3.49 11.716 3.72 27.245 4.617 32.451l0 0.049c0.001-0.008-0.001-0.017 0-0.024 0.001 0.008 0 0.017 0 0.024l0-0.049c1-5.20499 1.132-20.73499 4.621-32.451 1.498-4.724 2.658-6.906 4.252-9.875 2.166-3.531 3.307-5.443 9.587-11.82 0 0 5.071-5.852 6.579-11.108 0.873-2.269 1.576-4.631 1.734-7.07 0.108-6.43-2.138-12.871-6.237-17.828z"/>' + profession[professional.profession] + '</svg>')
                            },
                            events: {
                                click: function () {
                                    if ($scope.openedWindow) {
                                        $scope.openedWindow.show = false;
                                    }
                                    $scope.openedWindow = professional.marker.window;
                                    professional.marker.window.show = true;
                                    $scope.$apply();
                                },
                                mouseover: function (marker) {
                                    marker.icon.size = marker.icon.scaledSize = $scope.bigMarkerSize;
                                    $scope.$apply();
                                },
                                mouseout: function (marker) {
                                    marker.icon.size = marker.icon.scaledSize = null;
                                    $scope.$apply();
                                }
                            },
                            window: {
                                show: false,
                                options: {
                                    boxClass: 'custom-info-window',
                                    closeBoxURL: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="21" height="21" viewBox="0 0 450 450" xml:space="preserve"><path fill="#1A8CFF" d="M107.1 39c10.3-3.4 22.6-1.2 30.4 6.6 28.4 28.3 56.7 56.7 85 85 2.5 2.5 4.8 5.2 7.6 7.3 3.4-2.5 5.9-6 8.9-8.9 25.5-25.5 51-51 76.5-76.5 4.2-4.2 8.3-8.6 13.5-11.5 6.3-3.5 13.9-4 20.9-2.8 6.9 1.4 12.6 5.8 17.3 10.7 13.3 13.4 26.8 26.6 39.9 40.1 9 9 10.9 24 4.9 35.1 -3.5 6.2-9 11-14 16 -25.2 25.2-50.3 50.3-75.5 75.5 -2.4 2.4-5 4.6-7 7.4 0.6 0.9 1.3 1.7 2 2.4 27.9 27.8 55.7 55.7 83.5 83.5 5.4 5.4 11.3 11 13.3 18.6 1.9 7.4 1.5 15.7-2.2 22.5 -2.6 4.8-6.6 8.7-10.5 12.6 -12.7 12.6-25.2 25.5-38.1 37.9 -11.1 10.8-30.8 10.6-41.4-0.7 -28.2-28.1-56.3-56.3-84.5-84.4 -2.5-2.4-4.7-5.1-7.5-7.1 -2.4 1.9-4.4 4.2-6.6 6.3 -26.6 26.7-53.3 53.3-80 80 -5.2 5.3-10.8 10.8-18.2 12.8 -7.6 1.9-16.2 1.4-23.1-2.6 -3.7-2.1-6.8-5.2-9.8-8.2 -13.3-13.4-26.7-26.6-39.9-40 -10.7-10.9-10.7-30.2 0.1-41 28.3-28.4 56.7-56.6 85-85 2.5-2.5 5.2-4.8 7.3-7.6 -0.6-1-1.4-1.8-2.2-2.6 -29.2-29.1-58.3-58.3-87.6-87.5 -4.4-4.2-8.2-9.3-9.6-15.3 -1.6-7-1.3-14.6 2.1-21 2.7-5.4 7.1-9.6 11.3-13.8 11.5-11.5 23-23 34.5-34.5C97.2 44.4 101.7 40.8 107.1 39z"/></svg>',
                                    closeBoxMargin: '3px'
                                }
                            }
                        };
                    });
                }, $scope.checkTokenError);
            };
        }]);
    app.register.service('specialtyTags', function ($q, $rootScope) {
        $rootScope.q = $q
    });

    return app;
});