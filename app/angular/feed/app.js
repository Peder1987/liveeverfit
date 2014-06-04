'use strict';

define(['app', 'masonry'], function (app, Masonry) {
    app.register.directive('entryFeed', ['$resource', '$upload', '$sce', 'rest', 'localStorageService', 'fileReader', 'tokenError',
        function ($resource, $upload, $sce, rest, localStorageService, fileReader, tokenError) {
            return {
                templateUrl: 'feed/index.html',
                require: '?ngModel',
                link: function ($scope, element, attrs, ngModel) {
                    angular.extend($scope, {
                        user_id: localStorageService.get('user_id'),
                        usrImg: localStorageService.get('user_img'),
                        entryInputPlaceHolder: $sce.trustAsHtml("Encourage, motivate, persevere, succeed..."),
                        entryInputText: "",
                        entryVideoURL: "",
                        entryBlogBody: "",
                        entryVideoURLID: "",
                        entryInputType: "text",
                        fromDatePickerOpened: false,
                        untilDatePickerOpened: false,
                        entryEvent: {
                            start: "",
                            end: "",
                            allDay: false
                        },
                        likeEntry: function (entry) {
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
                        getTrustedURL: function (url) {
                            return $sce.trustAsResourceUrl(url);
                        },
                        getTrustedHtml: function (html) {
                            return $sce.trustAsHtml(html);
                        },
                        runMasonry: function () {
                            if ($scope.msnry)$scope.msnry.destroy();
                            setTimeout(function () {
                                $scope.msnry = new Masonry(".newsFeed .row", {
                                    columnWidth: '.grid-sizer',
                                    itemSelector: '.item',
                                    transitionDuration: '0.2s'
                                });
                            }, 3);
                        },
                        refreshMasonry: function () {
                            setTimeout(function () {
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
                                                url: $scope.entryVideoURLID,
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
                        entryShare: function (entry) {
                            var id, 
                            entryCollection = $resource(":protocol://:url/feed/shared", {
                                protocol: $scope.restProtocol,
                                url: $scope.restURL
                            }, {
                                update: {
                                    method: 'PUT'
                                }
                            });

                            if(entry.type == 'shared'){
                                id = entry.shared_entry.id;
                            }else{
                                id = entry.id;
                            }

                            entryCollection.save({
                                    user: $scope.user_id,
                                    entry: id
                                },
                                function (data) {
                                $scope.feedList.unshift(data);
                                $scope.runMasonry();
                            });
                        },
                        selectEntryInputType: function (type) {
                            $scope.entryInputType = type;
                            $scope.refreshMasonry();
                            $scope.entryImgSrc = '';
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
                        },
                        deleteEntry: function (index, entry) {
                            var entryObj = {
                                id: entry.id,
                                type: entry.type

                            };
                            $scope.feedList.splice(index, 1);
                            $scope.runMasonry();
                            $scope.entryResource.delete(entryObj, $.noop());
                        },
                        flagEntry: function (entry) {
                            $scope.flagResource.save({
                                entry: entry.id,
                                reporter: $scope.user_id
                            }, function () {

                            });
                        },
                        submitComment: function (entry) {
                            var scope = this,
                                commentObj = {
                                    text: entry.commentInput,
                                    user: $scope.user_id,
                                    entry: entry.id
                                };
                            $scope.commentResource.save(commentObj, function (data) {
                                entry.comments.push(data);
                                setTimeout(function () {
                                    $scope.msnry.layout();
                                });
                                entry.commentInput = '';
                            });
                        },
                        deleteComment: function (index, comment, entry) {
                            var commentObj = {
                                id: comment.id
                            };
                            entry.comments.splice(index, 1);
                            $scope.commentResource.delete(commentObj, function () {

                            });
                        },
                        editComment: function (index, comment) {
                            var attrs;
                            $scope.commentResource.update(comment, function () {

                            });
                        },
                        likeResource: $resource(":protocol://:url/feed/likes/:id", {
                            protocol: $scope.restProtocol,
                            url: $scope.restURL,
                            id: '@id'
                        }, {
                            update: {
                                method: 'PUT'
                            }
                        }),
                        feedCollection: $resource(":protocol://:url/feed:filter/:id", {
                            protocol: $scope.restProtocol,
                            url: $scope.restURL,
                            filter: '@filter',
                            id: '@id'
                        }, {
                            update: { method: 'PUT' }
                        }),
                        entryResource: $resource(":protocol://:url/feed/:type/:id", {
                            id: "@id",
                            type: "@type",
                            protocol: $scope.restProtocol,
                            url: $scope.restURL
                        }, {
                            update: { method: 'PUT' }
                        }),
                        commentResource: $resource(":protocol://:url/feed/comment/:id", {
                            id: '@id',
                            protocol: $scope.restProtocol,
                            url: $scope.restURL
                        }, {
                            update: { method: 'PUT' }
                        }),
                        flagResource: $resource(":protocol://:url/feed/flag", {
                            protocol: $scope.restProtocol,
                            url: $scope.restURL
                        }),
                        init: function () {
                            $scope.feed_id = ngModel.$viewValue.id;
                            $scope.feedCollection.get({id: $scope.feed_id, filter: ngModel.$viewValue.filter}, function (data) {
                                $scope.feedList = data.results;
                                $scope.runMasonry();
                            }, $scope.checkTokenError);
                        }
                    });
                    // model -> view
                    if (ngModel) {
                        ngModel.$render = function () {
                            if(ngModel.$viewValue) {
                                $scope.init();
                                $scope.filter = ngModel.$viewValue.filter;
                            }
                        };
                        ngModel.$render();
                    }
                }
            }
        }]);
    return app;
});