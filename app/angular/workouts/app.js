'use strict';

define(['app', 'videojs'], function (app) {
    app.register.controller('workoutsCtrl', ['$scope', 'restricted',
        function ($scope) {
            $scope.restricted();
        }]);

    app.register.controller('workoutsController', ["$sce", "$stateParams", "$resource", "rest", "tokenError", "localStorageService", "$scope", "$anchorScroll", "promiseService",
        function ($sce, $stateParams, $resource, rest, tokenError, localStorageService, $scope) {
            $scope.page = 1
            $scope.difficulty = [];
            $scope.videoSelected = [];
            $scope.tagSelected = [];
            $scope.iframeHidden = true;
            $scope.difficultySelected = {}; 
            $scope.video = {}; // for 1 video
            $scope.videos = []; //for video list
            $scope.videoSearch = ''; // this is the search bar string
            $scope.videoTitles = [] // for typeahead
            $scope.next = true;
            $scope.comments = []  
            $scope.commentPage = 1;
            $scope.commentNext = false;
            var tagCollection = $resource(":protocol://:url/tags/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });
            var tagResource = $resource(":protocol://:url/tags/:id/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            }, {update: { method: 'PUT' }});

            
            
            var videoCollection = $resource(":protocol://:url/workouts/video/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }),
                commentCollection = $resource(":protocol://:url/workouts/video/comments/:id/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL,
                    id: '@id'
                }),
                videoResource = $resource(":protocol://:url/workouts/video/:id/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL,
                    id: '@id'
                }, {
                    update: { method: 'PUT' }
                }),
                getVideo = function () {
                    if ($scope.videojs) $scope.videojs.dispose();
                    if ($stateParams.id) {
                        $scope.videoStatus = 'loading';
                        $scope.video = videoResource.get({id: $stateParams.id}, function () {
                            $scope.video.rtmp_url = $sce.trustAsResourceUrl("rtmp://206.225.86.237:1935/vod/_definst_/mp4:" + $scope.video.url_video);
                            $scope.video.http_url = $sce.trustAsResourceUrl("http://206.225.86.237:1935/vod/content/" + $scope.video.url_video + "/playlist.m3u8");
                            $scope.videoStatus = 'difficultySelected';
                            commentCollection.get({id: $stateParams.id}, function(data){
                                $scope.commentNext = data.next;
                                $scope.comments = data.results;

                            });
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
                        $scope.videoStatus = false;
                    }
                },
                filterVideoCollection = $resource(":protocol://:url/workouts/video?:filter", {
                    protocol: $scope.restProtocol,
                    filter: '@filter',
                    url: $scope.restURL
                });
            //initialize video array
            var initVideos = filterVideoCollection.get({}, function () {
                $scope.next = initVideos.next;
                $scope.videos = initVideos.results;
            });

            $scope.videoTitleCollection =  $resource("http://:url/workouts/titles",{
                url: $scope.restURL
            });
            $scope.loadVideoTitles = function (query) {
                var deferred = $scope.q.defer();
                var filtering = {
                    search: query,
                };
                $scope.videoTitles =  $scope.videoTitleCollection.query(filtering, function () {
                    deferred.resolve($scope.videoTitles);
                });

                return deferred.promise;
            };

            $scope.getPros = function (){
                $scope.page = $scope.page + 1;
                $scope.filtering = {
                    difficulty: $scope.difficulty,
                    tags: $scope.tagSelected,
                    search : $scope.videoSelected,
                    page : $scope.page
                };
                var newVideos = filterVideoCollection.get($scope.filtering, function () {
                    $scope.videos = $scope.videos.concat(newVideos.results);
                    $scope.next = newVideos.next;
                });
                //$scope.videos = ;
            };
            $scope.getComments = function (){
                $scope.commentPage = $scope.commentPage + 1;
                
                var newComments = commentCollection.get({page:$scope.commentPage, id:$stateParams.id}, function () {
                    $scope.comments = $scope.comments.concat(newComments.results);
                    $scope.commentNext = newComments.next;
                });
                //$scope.videos = ;
            };

            
            window.handleIframe = function(iframe) {
                var $iframe = $(iframe);
                $iframe.height($iframe.width() * 0.75);
                $(window).resize(function () {
                    $iframe.height($iframe.width() * 0.75);
                });
                $iframe.removeClass("hidden");
            };

            videojs.options.flash.swf = "common/videojs/dist/video-js/video-js.swf";

            $scope.$on('$stateChangeSuccess', getVideo);
            

            
            $scope.difficultyOnClick = function (value) {
                if ($scope.difficulty.indexOf(value) == -1) {
                    $scope.difficultySelected[value] = true;
                    $scope.difficulty.push(value);
                }
                else {
                    var temp = $scope.difficulty.indexOf(value);
                    $scope.difficultySelected[value] = false;
                    $scope.difficulty.splice(temp, 1);
                }
                $scope.filter();
            };
            $scope.filter = function () {
                $scope.page = 1
                $scope.commentPage = 1;
                $scope.filtering = {
                    difficulty: $scope.difficulty,
                    tags: $scope.tagSelected,
                    search : $scope.videoSelected
                };
                var vids = filterVideoCollection.get($scope.filtering, function () {
                    $scope.videos = vids.results;
                    $scope.next = vids.next;
                });

                
            };

             /*ANYTHING TAG RELATED, kept it in same scope in order make things less complicated
              on review decide on how to do this*/

            $scope.tags = tagCollection.get(function () {
            }, $scope.checkTokenError);


            $scope.addTag = function (tag) {


                if($scope.videoSearch.indexOf(tag) == -1){
                 $scope.videoSearch.push(tag);
                 $scope.tagSelected.push(tag.name);
                 }
                 else {
                 var temp = $scope.videoSearch.indexOf(tag);
                 $scope.videoSearch.splice(temp, 1);
                 $scope.tagSelected.splice(temp, 1);
                 }

                 
                 
                $scope.filter()
            }
            $scope.onTagAdd = function(tag) {         
                $scope.names = [];
                
                $scope.tags.results.forEach(function(obj) {
                    $scope.names.push(obj.name);
                });
                
                if($scope.names.indexOf(tag.name) == -1){
                    $scope.videoSelected.push(tag.name);
                 }
                 else{
                    $scope.tagSelected.push(tag.name);  
                 }

                
                $scope.filter()

            }
            $scope.onDeleteTag = function(tag) {
                if($scope.tagSelected.indexOf(tag.name) != -1){
                    var temp = $scope.tagSelected.indexOf(tag.name);

                    $scope.tagSelected.splice(temp, 1);
                    $scope.filter()

                };
                if($scope.videoSelected.indexOf(tag.name) != -1);
                    var temp = $scope.videoSelected.indexOf(tag.name);

                    $scope.videoSelected.splice(temp, 1);
                    $scope.filter()

                };


        }]);

    app.register.service('promiseService', function($q, $rootScope) {

      $rootScope.q = $q
      
    });
});
