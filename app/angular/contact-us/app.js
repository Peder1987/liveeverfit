'use strict';

define(['app'], function(app) {

    app.register.controller('contact-usCtrl', ['$scope', 
    	function($scope) {
    }]);



    app.register.directive('imgCropped', ['$window',
        function($window) {

            var bounds = {};

            return {
                restrict: 'E',
                replace: true,
                scope: { src:'=', selected:'&' 
            },
            link: function (scope, element, attr){
                scope.$parent.myImg; 
                var clear = function() {
                    if (scope.$parent.myImg) {
                        scope.$parent.myImg.next().remove();
                        scope.$parent.myImg.remove();
                        scope.$parent.myImg = undefined;
                    }
                };

                scope.$watch('src', function (nv) {
                    clear();
                    console.log('[src]');
                    console.log(nv);
                    if (!nv) { // newValue
                        return;
                    }
                    element.after('<img style="max-width: 100%;"/>');
                    scope.$parent.myImg = element.next();
                    scope.$parent.myImg.attr('src', nv);
                    $window.jQuery(scope.$parent.myImg).Jcrop({ 
                        trackDocument: true, 
                        onSelect: function(cords) {
                            scope.$apply(function() {
                                cords.bx = bounds.x;
                                cords.by = bounds.y;
                                scope.selected({cords: cords});
                            });
                        }, 
                        aspectRatio: 1.333333333333333333
                    }, 
                    function(){
                        var boundsArr = this.getBounds();
                        bounds.x = boundsArr[0];
                        bounds.y = boundsArr[1];
                    });
                });
                scope.$on('$destroy', clear);
              }
            };

    }]);


    app.register.factory('fileReader', 
        function($q){
            var onLoad = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            };
            var onError = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.result);
                    });
                };
            };
            var onProgress = function (reader, scope) {
                return function (event) {
                    scope.$broadcast(
                        "fileProgress", 
                        { total: event.total,
                            loaded: event.loaded
                        });
                };
            };
            var getReader = function (deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                reader.onprogress = onProgress(reader, scope);
                return reader;
            };
            var readAsDataURL = function (file, scope) {
                var deferred = $q.defer();
                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };
            return { readAsDataUrl: readAsDataURL };
    });


    app.register.directive('fileselect', [
        function(){
            return {
                link: function(scope, element, attributes) {
                    element.bind("change", function(changeEvent) {
                        scope.img = changeEvent.target.files[0];
                        scope.getFile();
                    });
                }
            };
    }]);


    app.register.controller('ProfilePicCtrl', ['$window', '$timeout', '$scope', 'fileReader',
        function($window, $timeout, $scope, fileReader) {

            console.log(fileReader);

            $scope.getFile = function(){
                $scope.progress = 0;
                fileReader.readAsDataUrl($scope.img, $scope).then(function(result) {
                    $scope.imageSrc = result;
                });
                $timeout(function () {
                  $scope.initJcrop();
                });
            };


            $scope.$on("fileProgress", function(e, progress) {
                $scope.progress = progress.loaded / progress.total;
            });


            $scope.initJcrop = function(){
                console.log('init jcrop');
                $window.jQuery('img.aj-crop').Jcrop({
                    onSelect: function(){
                        //$scope.$apply();
                        console.log('onSelect', arguments);
                    }, 
                    onChange: function(){
                        //$scope.$apply();
                        console.log('onChange', arguments);
                    }, 
                    trackDocument: true, 
                    aspectRatio: 1.333333333333333333
                });
            };

            $scope.cropOpts = {
              ratioW: 1, 
              ratioH: 1
            };
            $scope.selected = function (cords) {
              var scale;

              $scope.picWidth = cords.w;
              $scope.picHeight = cords.h;

              console.log('scale');
              if ($scope.picWidth > 400) {
                scale = (400 / $scope.picWidth);
                console.log($scope.picHeight);
                $scope.picHeight *= scale;
                $scope.picWidth *= scale;
                console.log(scale);
              }

              if ($scope.picHeight > 400) {
                scale = (400 / $scope.picHeight);
                $scope.picHeight *= scale;
                $scope.picWidth *= scale;
                console.log(scale);
              }

              console.log('[cords]', $scope.picWidth / $scope.picHeight);
              console.log(cords);
              $scope.cropped = true;
              console.log($scope);

              var rx = $scope.picWidth / cords.w, 
                    ry = $scope.picHeight / cords.h, 
                    canvas = document.createElement("canvas"), 
                    context = canvas.getContext('2d'), 
                    imageObj = $window.jQuery('img#preview')[0];

              $window.jQuery('img#preview').css({
                width: Math.round(rx * cords.bx) + 'px',
                height: Math.round(ry * cords.by) + 'px',
                marginLeft: '-' + Math.round(rx * cords.x) + 'px',
                marginTop: '-' + Math.round(ry * cords.y) + 'px'
              });

            };

           
    }]);






    
});