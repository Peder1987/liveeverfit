'use strict';

define(['app'], function(app) {

    app.register.controller('profileCtrl', ['$scope', '$resource', '$modal', '$http', 'localStorageService', 'rest', 'tokenError',
        function ($scope, $resource, $modal, $http, localStorageService, tokenError) {
            $scope.user_id = localStorageService.get('user_id');
            var userResource = $resource(":protocol://:url/users/:id/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: $scope.user_id
            }, {update: { method: 'PUT' }});

            var professionalResource = $resource(":protocol://:url/users/professionals/:id/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: $scope.user_id
            }, {update: { method: 'PUT' }});
            //init
            $scope.profile_user = userResource.get(function () {
                if ($scope.profile_user.type == "professional") {
                    $scope.profileResource = professionalResource

                } else {
                    $scope.profileResource = userResource
                }
            }, $scope.checkTokenError);


            
    }]);
	app.register.controller('feedController', ['localStorageService', '$scope', '$resource', 'rest', 'fileReader', '$upload', '$sce',
        function (localStorageService, $scope, $resource, rest, fileReader, $upload, $sce) {
        	$scope.feedList = [];
        	$scope.user_id = localStorageService.get('user_id');
            angular.extend($scope, {
                entryInputPlaceHolder: $sce.trustAsHtml("Encourage, motivate, persevere, succeed..."),
                entryInputText: "",
                entryVideoURL: "",
                entryBlogBody: "",
                entryVideoURLID: "",
                entryInputType: "video",
                entryYouTubeChange: function () {
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
                    fileReader.readAsDataUrl($scope.uploadImg, $scope).then(function (result) {
                        $scope.entryImgSrc = result;
                        $scope.percent = undefined;
                    });
                }
            });
            $scope.user_id = localStorageService.get('user_id');
            $scope.user_email = localStorageService.get('user_email');
            $scope.feedCollection = $resource(":protocol://:url/feed/:id", {
            	id : $scope.user_id,
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
            });
            $scope.deleteEntry = function (index, entry) {
                var entryObj = {
                    id: entry.id,
                    type: entry.type

                }
                $scope.feedList.splice(index, 1);
                $scope.entryResource.delete(entryObj, function () {

                });
            };
            $scope.flagEntry = function (entry){
                console.log(entry.id)
                var entryObj = {
                    entry : entry.id,
                    reporter : $scope.user_id

                }
                
                $scope.flagResource.save(entryObj, function(){

                });
            };

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


    
});