/*######################################################
 This app returns a ng module which is declared to
 be the main module for the entire app.

 Logic can be applied to set up the home page
 ######################################################*/
'use strict';


define(['angularAMD', 'uiRouter','geolocation','uiBootstrap','routeResolver','angularResource','angularLocalStorage','autoFillEvent','jquery','jqueryui','fullcalendar','ui.calendar','ui.utils','ngTagsInput', 'underscore','angular-google-maps','stripeJS','stripe',"xeditable",'jcrop','angularFileUpload', 'bootstrap.wysihtml5.en-US'], function (angularAMD) {
    'use strict';

    var app = angular.module('app', ['ui.router','ui.route','ui.bootstrap','ui.bootstrap.datepicker','ngTagsInput','ui.bootstrap.timepicker','ui.bootstrap.modal','ui.bootstrap.carousel','routeResolverServices','ngResource','LocalStorageModule','ui.calendar','ui.bootstrap.tabs','ui.bootstrap.pagination','google-maps','xeditable','geolocation','angularFileUpload']);
    
    app.run(function ($http, localStorageService, editableOptions) {
        editableOptions.theme = 'bs3';
        $http.defaults.headers.common['Authorization'] = localStorageService.get('Authorization');
    });

    app.config(['routeResolverProvider', '$stateProvider', '$urlRouterProvider',
        function (routeResolverProvider, $stateProvider, $urlRouterProvider) {
            var route = routeResolverProvider.route;
            $stateProvider
                //LoggedIn and LoggedOut
                .state('home', route.resolve('/', 'home'))
                .state('home.referred', route.resolve('/:email', 'home'))
                .state('footer', route.resolve('/', 'footer'))

                //LoggedOut
                .state('about', route.resolve('/about', 'about'))
                .state('contact', route.resolve('/contact', 'contact'))
                .state('forgot-password', route.resolve('/forgot-password', 'auth/forgot-password'))
                .state('reset-password', route.resolve('/reset-password/:change_password_token/:email', 'auth/reset-password'))
                .state('registration', route.resolve('/registration', 'auth/registration'))
                .state('registration.tier', route.resolve('/:tier', 'auth/registration'))
                .state('registration.tier.profession', route.resolve('/:pro', 'auth/registration'))
                .state('login', route.resolve('/login', 'auth/login'))

                //LoggedIN
                .state('settings', route.resolve('/settings', 'settings'))
                .state('messages', route.resolve('/messages', 'messages'))
                .state('messages.view', route.resolve('/:view', 'messages'))
                .state('messages.view.reply', route.resolve('/new/:recipient', 'messages'))
                .state('messages.view.detail', route.resolve('/:index', 'messages'))
                .state('workouts', route.resolve('/workouts', 'workouts'))
                .state('workouts.video', route.resolve('/:id', 'workouts'))
                .state('fitness-professional', route.resolve('/fitness-professional', 'fitness-professional'))
                .state('evergreen', route.resolve('/evergreen', 'evergreen'))
                .state('change-password', route.resolve('/change-password', 'auth/change-password'))
                .state('terms', route.resolve('/terms', 'terms'))
                .state('faq', route.resolve('/faq', 'faq'))
                .state('membership', route.resolve('/membership', 'membership'))
                .state('profile', route.resolve('/profile', 'profile'))
                .state('profile.view', route.resolve('/:view', 'profile'));

            $urlRouterProvider.otherwise("/");
        }
    ]);

    app.service('rest', ['$rootScope', function ($rootScope) {
        $rootScope.restProtocol = "http";
        $rootScope.restURL = "localhost:8000";
    }]);

    app.service('restricted', ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
        $rootScope.restricted = function () {
            $rootScope.token = localStorageService.get('Authorization');
            if ($rootScope.token === null) {
                window.location = "/#/";
            }
        }
    }]);

    app.service('tokenError', ['$rootScope', function ($rootScope) {
        $rootScope.checkTokenError = function (error) {
            if (error.data && error.data['detail'] == 'Invalid token') {
                window.location = '/#/logout';
            }
        }
    }]);

    app.controller('NavCtrl', ['localStorageService', '$state', '$scope',
        function(localStorageService, $state, $scope) {
            $scope.isCollapsed = true;
            $scope.token = localStorageService.get('Authorization');
            if($scope.token) {
                $scope.templateNav = {
                    url: 'navbar/index.html'
                };
                $scope.signOut = function() {
                    localStorageService.clearAll();
                    window.location = "/";
                }
            }
        }]);

    app.controller('PageCtrl', ['localStorageService', '$scope',
        function(localStorageService, $scope) {
            $scope.token = localStorageService.get('Authorization');
        }]);


    app.controller('footerCtrl', ['localStorageService', '$scope', 
        function(localStorageService, $scope) {
            $scope.isCollapsed = true;
            $scope.token = localStorageService.get('Authorization');
            $scope.templateNav = {
                url: 'footer/index.html'
            };
    }]);

    app.directive('ng-blur', function() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                element.bind('blur', function () {
                    scope.$apply(attrs.ngBlur);
                });
            }
        };
    });
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    app.factory('fileReader', function ($q) {
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
                scope.$apply(function() {
                    scope.percent = parseInt(100.0 * event.loaded / event.total);
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

    //Bootstrap Angular
    angularAMD.bootstrap(app);


    return app;
});