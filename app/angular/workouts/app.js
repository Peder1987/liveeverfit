'use strict';

define(['app', 'videojs'], function (app) {
    app.register.controller('workoutsCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }]);

    app.register.controller('workoutsController', ["$sce", "$stateParams", "$resource", "rest", "tokenError", "localStorageService", "$scope", "$anchorScroll",
        function ($sce, $stateParams, $resource, rest, tokenError, localStorageService, $scope, $q) {
            var videoCollection = $resource(":protocol://:url/workouts/video/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }),
                videoResource = $resource(":protocol://:url/workouts/video/:id/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL,
                    id: '@id'
                }, {
                    update: { method: 'PUT' }
                }),
                getVideo = function () {
                    if ($stateParams.id) {
                        $scope.videoStatus = 'loading';
                        if ($scope.videojs) $scope.videojs.dispose();
                        $scope.video = videoResource.get({id: $stateParams.id}, function () {
                            $scope.video.rtmp_url = $sce.trustAsResourceUrl("rtmp://206.225.86.237:1935/vod/_definst_/mp4:" + $scope.video.url_video);
                            $scope.video.http_url = $sce.trustAsResourceUrl("http://206.225.86.237:1935/vod/content/" + $scope.video.url_video + "/playlist.m3u8");
                            $scope.videoStatus = 'selected';
                            setTimeout(function () {
                                $scope.videojs = videojs('selectedVideo', {
                                    techOrder: [ "flash", "html5"]
                                });
                                $scope.videojs.height($scope.videojs.el().offsetWidth * 0.75);
                                $(window).resize(function () {
                                    $scope.videojs.height($scope.videojs.el().offsetWidth * 0.75);
                                });
                            }, 10);
                            if($scope.video.likes_user.indexOf(parseInt(localStorageService.get("user_id"))) >= 0) {
                                $scope.video.like = "unlike";
                            }
                            else {
                                $scope.video.like = "like";
                            }
                        })
                    }
                    else {

                    }
                },
                filterVideoCollection = $resource(":protocol://:url/workouts/video?:filter", {
                    protocol: $scope.restProtocol,
                    filter: '@filter',
                    url: $scope.restURL
                });

            $scope.videoTitleCollection =  $resource("http://:url/users/titles?search",{
                url: $scope.restURL
            });
            $scope.loadVideoTitles = function (value) {
                var array = [];
                var deferred = $q.defer();
                console.log('dib');
                deferred.resolve([{ text: 'Tag9' },{ text: 'Tag10' }]);
                return deferred.promise;
            };

            $scope.difficulty = [];
            $scope.tagSelected = [];
            $scope.search = '';
            $scope.video = {};

            window.handleIframe = function(iframe) {
                var $iframe = $(iframe);
                $iframe.height($iframe.width() * 0.75);
                $(window).resize(function () {
                    $iframe.height($iframe.width() * 0.75);
                });
            };

            videojs.options.flash.swf = "common/videojs/dist/video-js/video-js.swf";

            $scope.$on('$stateChangeSuccess', getVideo);
            $scope.videos = videoCollection.get(function () {
            }, $scope.checkTokenError);

            $scope.selected = {};
            $scope.difficultyOnClick = function (value) {
                if ($scope.difficulty.indexOf(value) == -1) {
                    $scope.selected[value] = true;
                    $scope.difficulty.push(value);
                }
                else {
                    var temp = $scope.difficulty.indexOf(value);
                    $scope.selected[value] = false;
                    $scope.difficulty.splice(temp, 1);
                }
                $scope.filter();
            };
            $scope.filter = function () {
                $scope.filtering = {
                    difficulty: $scope.difficulty,
                    tags: $scope.tagSelected
                };
                //console.log($scope.filtering)
                $scope.videos = filterVideoCollection.get($scope.filtering, function () {
                });
            };

            /*ANYTHING TAG RELATED, kept it in same scope in order make things less complicated*/
            var tagCollection = $resource(":protocol://:url/tags/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            var tagResource = $resource(":protocol://:url/tags/:id/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            }, {update: { method: 'PUT' }});

            $scope.tags = tagCollection.get(function () {
            }, $scope.checkTokenError);


            $scope.addTag = function (tag) {


                if($scope.search.indexOf(tag) == -1){
                 $scope.search.push(tag);
                 $scope.tagSelected.push(tag.name);
                 }
                 else {
                 var temp = $scope.search.indexOf(tag);
                 $scope.search.splice(temp, 1);
                 $scope.tagSelected.splice(temp, 1);
                 }

                 $scope.filter()
                 
                $scope.filter()
            }
        }]);

    app.register.directive('scrollOnTag', function () {
        return {
            restrict: 'A',
            link: function (scope, $elm, attrs) {
                $elm.on('click', function () {
                    var $target;
                    //$target = $('#workoutsHeader');
                    //$("body").animate({scrollTop: $target.offset().top}, "slow");
                });
            }
        }
    });


});
