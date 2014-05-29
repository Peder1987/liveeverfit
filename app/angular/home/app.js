'use strict';

define(['app', 'masonry'], function (app, Masonry) {
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
    app.register.controller('feedController', ['localStorageService', '$scope', '$resource', 'rest', 'fileReader', '$upload', '$sce',
        function (localStorageService, $scope, $resource, rest, fileReader, $upload, $sce) {
            angular.extend($scope, {
                usrImg: localStorageService.get('user_img'),
                entryInputPlaceHolder: $sce.trustAsHtml("Encourage, motivate, persevere, succeed..."),
                entryInputText: "",
                entryVideoURL: "",
                entryBlogBody: "",
                entryVideoURLID: "",
                entryInputType: "text",
                likeEntry: function(entry) {
                    //Some Functionality to like
                    //made user_id so it doesn't update entry
                    // for this user to become the owner
                    $scope.likeResource.update({
                        id: entry.id,
                        user_id: $scope.user_id
                    }, function (data) {
                        entry.user_likes = data.user_likes;
                        if (data.user_likes) {
                            entry.likes += 1;
                        } else {
                            entry.likes -= 1;
                        }
                    });
                },
                getTrustedURL: function(url) {
                    return $sce.trustAsResourceUrl(url);
                },
                getTrustedHtml: function (html) {
                    return $sce.trustAsHtml(html);
                },
                runMasonry: function() {
                    if($scope.msnry)$scope.msnry.destroy();
                    setTimeout(function() {
                        $scope.msnry = new Masonry(".newsFeed .row", {
                            columnWidth: '.grid-sizer',
                            itemSelector: '.item',
                            transitionDuration: '0.2s'
                        });
                    }, 3);
                },
                refreshMasonry: function() {
                    setTimeout(function() {
                        $scope.msnry.layout();
                    });
                },
                entryYouTubeChange: function () {
                    $scope.refreshMasonry();
                    if ($scope.entryVideoURL) {
                        if ($scope.entryVideoURL.indexOf("watch?v=") > -1) {
                            $scope.entryVideoURLID = '//www.youtube.com/embed/' + this.entryVideoURL.slice(this.entryVideoURL.indexOf("watch?v=") + 8)
                            $scope.entryVideoURLIDTrusted = $sce.trustAsResourceUrl(this.entryVideoURLID);
                            return;
                        }
                        else if ($scope.entryVideoURL.indexOf("http://youtu.be/") > -1) {
                            $scope.entryVideoURLID = '//www.youtube.com/embed/' + this.entryVideoURL.slice(this.entryVideoURL.indexOf("youtu.be/") + 9);
                            $scope.entryVideoURLIDTrusted = $sce.trustAsResourceUrl(this.entryVideoURLID);
                            return;
                        }
                        else if ($scope.entryVideoURL.indexOf("embed/") > -1) {
                            $scope.entryVideoURLID = '//www.youtube.com/embed/' + this.entryVideoURL.slice(this.entryVideoURL.indexOf("embed/") + 6);
                            $scope.entryVideoURLIDTrusted = $sce.trustAsResourceUrl(this.entryVideoURLID);
                            return;
                        }
                    }
                    $scope.entryVideoURLID = $scope.entryVideoURLIDTrusted = '';
                },
                entryEvent: {
                    start: "",
                    end: "",
                    allDay: false
                },
                fromDatePickerOpened: false,
                untilDatePickerOpened: false,
                openFromDatePicker: function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    this.fromDatePickerOpened = !this.fromDatePickerOpened;
                },
                openUntilDatePicker: function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    this.untilDatePickerOpened = !this.untilDatePickerOpened;
                },
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
                                    text: $scope.entryInputText,
                                    user: $scope.user_id
                                }, function (data) {
                                    $scope.feedList.unshift(data);
                                    $scope.entryInputText = '';
                                    $scope.runMasonry();
                                });
                            },
                            photo: function () {
                                if ($scope.uploadImg) {
                                    $scope.upload = $upload.upload({
                                        url: $scope.restProtocol + '://' + $scope.restURL + '/feed/photo',
                                        data: {
                                            user: $scope.user_id,
                                            text: $scope.entryInputText
                                        },
                                        file: $scope.uploadImg,
                                        fileFormDataName: 'img'
                                    }).progress(function (evt) {
                                        $scope.percent = parseInt(100.0 * evt.loaded / evt.total);
                                    }).success(function (data) {
                                        $scope.feedList.unshift(data);
                                        $scope.entryInputText = '';
                                        $scope.runMasonry();
                                        delete $scope.uploadImg;
                                        delete scope.entryImgSrc;
                                        $scope.percent = scope.percent = false;
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
                                if ($scope.entryVideoURLID) {
                                    this.entryCollection.save({
                                        text: $scope.entryInputText,
                                        url: $scope.this.entryVideoURLID,
                                        user: $scope.user_id
                                    }, function (data) {
                                        $scope.feedList.unshift(data);
                                        $scope.entryInputText = '';
                                        $scope.entryVideoURL = "";
                                        $scope.entryVideoURLID = "";
                                        $scope.entryVideoURLIDTrusted = "";
                                        $scope.runMasonry();
                                    })
                                } else {
                                    $scope.entryVideoURL = "";
                                }
                            },
                            event: function () {
                                if ($scope.entryEvent.start && $scope.entryEvent.end) {
                                    this.entryCollection.save({
                                        text: $scope.entryInputText,
                                        start: $scope.entryEvent.start,
                                        end: $scope.entryEvent.end,
                                        allDay: $scope.entryEvent.allDay,
                                        user: $scope.user_id
                                    }, function (data) {
                                        $scope.feedList.unshift(data);
                                        $scope.entryInputText = '';
                                        $scope.entryEvent = {
                                            start: "",
                                            end: "",
                                            allDay: false
                                        }
                                        $scope.runMasonry();
                                    });
                                }

                            },
                            blog: function () {
                                if ($scope.entryBlogBody) {
                                    this.entryCollection.save({
                                        text: $scope.entryInputText,
                                        body: $scope.entryBlogBody,
                                        user: $scope.user_id
                                    }, function (data) {
                                        $scope.feedList.unshift(data);
                                        $scope.entryInputText = '';
                                        $scope.entryBlogBody = '';
                                        $scope.runMasonry();
                                    });
                                }
                                else {
                                    $scope.entryBlogBody = "<b>Write something here...</b>";
                                    setTimeout(function () {
                                        $scope.entryBlogBody = "";
                                    }, 300);
                                }
                            },
                            comment: function () {

                            }
                        };
                    if ($scope.entryInputText) {
                        runEntrySubmit[$scope.entryInputType]();
                    } else {
                        $scope.entryInputPlaceHolder = $sce.trustAsHtml("<b>Type something here...</b>");
                        setTimeout(function () {
                            $scope.entryInputPlaceHolder = $sce.trustAsHtml("Encourage, motivate, persevere, succeed...");
                        }, 300);
                    }
                },
                selectEntryInputType: function (type) {
                    var scope = this;
                    scope.entryInputType = type;
                    scope.refreshMasonry();
                    scope.entryImgSrc = '';
                    if (type == 'event' || type == 'blog') {
                        $scope.entryInputPlaceHolder = $sce.trustAsHtml("Title or Description");
                        $scope.entryInputText = '';
                    }
                    else {
                        $scope.entryInputPlaceHolder = $sce.trustAsHtml("Encourage, motivate, persevere, succeed...");
                    }
                },
                onFileSelect: function ($files) {
                    $scope.uploadImg = $files[0];
                    $scope.refreshMasonry();
                    fileReader.readAsDataUrl($scope.uploadImg, $scope).then(function (result) {
                        $scope.entryImgSrc = result;
                        $scope.percent = undefined;
                        $scope.refreshMasonry();
                    });
                }
            });
            $scope.user_id = localStorageService.get('user_id');
            $scope.user_email = localStorageService.get('user_email');
            $scope.likeResource = $resource(":protocol://:url/feed/likes/:id/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
            $scope.feedCollection = $resource(":protocol://:url/feed", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            }, {
                update: { method: 'PUT' }
            });
            $scope.entryResource = $resource(":protocol://:url/feed/:type/:id", {
                id: "@id",
                type: "@type",
                protocol: $scope.restProtocol,
                url: $scope.restURL
            }, {
                update: { method: 'PUT' }
            });
            $scope.commentResource = $resource(":protocol://:url/feed/comment/:id", {
                id: '@id',
                protocol: $scope.restProtocol,
                url: $scope.restURL
            }, {
                update: { method: 'PUT' }
            });
            $scope.flagResource = $resource(":protocol://:url/feed/flag", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            //init feed
            $scope.feedCollection.get({}, function (data) {
                $scope.feedList = data.results;
                $scope.runMasonry();
            });
            $scope.deleteEntry = function (index, entry) {
                var entryObj = {
                    id: entry.id,
                    type: entry.type

                };
                $scope.feedList.splice(index, 1);
                $scope.runMasonry();
                $scope.entryResource.delete(entryObj, $.noop());
            };
            $scope.flagEntry = function (entry){
                $scope.flagResource.save({
                    entry : entry.id,
                    reporter : $scope.user_id
                }, function(){

                });
            };

            $scope.submitComment = function (entry) {
                var scope = this,
                    commentObj = {
                        text: entry.commentInput,
                        user: $scope.user_email,
                        entry: entry.id
                    };
                $scope.commentResource.save(commentObj, function (data) {
                    entry.comments.unshift(data);
                    setTimeout(function() {
                        $scope.msnry.layout();
                    });
                    entry.commentInput = '';
                });
            };

            $scope.deleteComment = function (index, comment, entry) {
                var commentObj = {
                    id: comment.id
                };
                entry.comments.splice(index, 1);
                console.log(commentObj)

                $scope.commentResource.delete(commentObj, function () {

                });
            };
            $scope.editComment = function (index, comment) {
                var attrs;
                $scope.commentResource.update(comment, function () {

                });
            };

        }]);

    app.register.directive('richTextEditor', function () {
        return {
            restrict: "A",
            require: '?ngModel',
            replace: true,
            transclude: true,
            template: '<div><textarea></textarea></div>',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model
                var textarea = $(element.find('textarea')).wysihtml5(),
                    editor = textarea.data('wysihtml5').editor;
                // view -> model
                editor.on('change', function () {
                    if (editor.getValue())
                        scope.$apply(function () {
                            ngModel.$setViewValue(editor.getValue());
                        });
                });
                // model -> view
                ngModel.$render = function () {
                    textarea.html(ngModel.$viewValue);
                    editor.setValue(ngModel.$viewValue);
                };
                ngModel.$render();
            }
        };
    });

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