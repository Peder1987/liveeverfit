'use strict';

define(['app'], function (app) {
    app.register.controller('homeCtrl', ['localStorageService', '$scope',
        function (localStorageService, $scope) {
            $scope.token = localStorageService.get('Authorization');
            if ($scope.token === null) {
                $scope.homeTemplate = {name: 'loggedout.html', url: 'home/views/loggedout.html'};
            } else {
                $scope.homeTemplate = {name: 'loggedin.html', url: 'home/views/loggedin.html'};
            }
        }]);
    app.register.controller('BannerCtrl', ['$scope',
        function ($scope) {
            var slides = $scope.slides = [
                {
                    image: '/home/img/slider/1.jpg'
                },
                {
                    image: '/home/img/slider/2.jpg'
                },
                {
                    image: '/home/img/slider/3.jpg'
                },
                {
                    image: '/home/img/slider/4.jpg'
                },
                {
                    image: '/home/img/slider/5.jpg'
                }
            ];
        }]);

    app.register.controller('homeController', ['localStorageService', '$scope',
        function (localStorageService, $scope) {
            $scope.token = localStorageService.get('Authorization');
            if ($scope.token === null) {
                $scope.homeTemplate = {name: 'loggedout.html', url: 'home/views/loggedout.html'};
            } else {
                $scope.homeTemplate = {name: 'loggedin.html', url: 'home/views/loggedin.html'};
            }
        }]);
    app.register.controller('feedController', ['localStorageService', '$scope', '$resource', 'rest', 'fileReader', '$upload',
        function (localStorageService, $scope, $resource, rest, fileReader, $upload) {
            angular.extend($scope, {
                entryInputText: "",
                entryInputType: "text",
                entrySubmit: function () {
                    var scope = this,
                        runEntrySubmit = {
                            entryCollection: $resource(":protocol://:url/feed/:type", {
                                type: $scope.entryInputType,
                                protocol: $scope.restProtocol,
                                url: $scope.restURL
                            }, {
                                update: {
                                    method: 'PUT'
                                }
                            }),
                            text: function () {
                                this.entryCollection.save({
                                    text: $scope.entryInputText
                                }, function (data) {
                                    $scope.feedList.push(data)
                                });
                            },
                            photo: function () {
                                if($scope.uploadImg && $scope.entryInputText) {
                                    $scope.upload = $upload.upload({
                                        url: $scope.restProtocol + '://' + $scope.restURL + '/feed/photo',
                                        img: $scope.uploadImg,
                                        text: $scope.entryInputText
                                    }).progress(function (evt) {
                                        $scope.percent = parseInt(100.0 * evt.loaded / evt.total);
                                    }).success(function (data) {
                                        delete $scope.uploadImg;
                                    }).error(function (data) {
                                        $scope.percent = false;
                                        console.log("Upload photo error.")
                                    });
                                }
                                else {
                                    // Some sort of error.
                                    console.log("No file selected.")
                                }

                            },
                            video: function () {

                            },
                            event: function () {

                            },
                            blog: function() {

                            },
                            comment: function() {

                            }
                        };
                    runEntrySubmit[$scope.entryInputType]();
                },
                selectEntryInputType: function (type) {
                    this.entryInputType = type;
                },
                onFileSelect: function ($files) {
                    $scope.uploadImg = $files[0];
                    fileReader.readAsDataUrl($scope.uploadImg, $scope).then(function (result) {
                        $scope.entryImgSrc = result;
                        $scope.percent = undefined;
                    });
                }
            });
            $scope.user_id = localStorageService.get('user_id');
            $scope.user_email = localStorageService.get('user_email');
            $scope.feedCollection = $resource(":protocol://:url/feed", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            }, {
                update: { method: 'PUT' }
            });
            $scope.commentResource = $resource(":protocol://:url/feed/comment", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            }, {
                update: { method: 'PUT' }
            });
            //init feed
            $scope.feedCollection.get({}, function (data) {
                $scope.feedList = data.results;
            });

            $scope.submitComment = function (obj) {
                var scope = this,
                    commentObj = {
                        text: scope.commentInput,
                        user: $scope.user_email,
                        entry: obj.id
                    };
                $scope.commentResource.save(commentObj, function (data) {
                    obj.comments.push(data)
                });
            };
        }]);

    app.register.directive('ngInput', function () {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
                    scope.$apply(readViewText);
                });

                // No need to initialize, AngularJS will initialize the text based on ng-model attribute

                // Write data to the model
                function readViewText() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && html == '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            }
        };
    });


    return app;
});