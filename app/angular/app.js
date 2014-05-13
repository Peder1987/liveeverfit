/*######################################################
 This app returns a ng module which is declared to
 be the main module for the entire app.

 Logic can be applied to set up the home page
 ######################################################*/
'use strict';

define(['angularAMD', 'uiRouter', 'uiBootstrap', 'routeResolver', 'angularResource', 'angularLocalStorage', 'autoFillEvent', 'jquery', 'jqueryui', 'fullcalendar', 'ui.calendar', 'ui.bootstrap.datepicker', 'ui.bootstrap.timepicker', 'ui.bootstrap.modal', 'ui.bootstrap.tabs', 'ngTagsInput', 'underscore','angular-google-maps', 'stripeJS', "stripe"], function (angularAMD) {
    'use strict';

    var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.datepicker', 'ngTagsInput', 'ui.bootstrap.timepicker', 'ui.bootstrap.modal', 'routeResolverServices', 'ngResource', 'LocalStorageModule', 'ui.calendar', 'ui.bootstrap.tabs', 'google-maps', ]);


    app.run(function ($http, localStorageService) {
        $http.defaults.headers.common['Authorization'] = localStorageService.get('Authorization');
    });

    app.config(['routeResolverProvider', '$stateProvider', '$urlRouterProvider',
        function (routeResolverProvider, $stateProvider, $urlRouterProvider) {
            var route = routeResolverProvider.route;
            $stateProvider
                //LoggedIn and LoggedOut
                .state('home', route.resolve('/', 'home'))
                .state('footer', route.resolve('/', 'footer'))

                //LoggedOut
                .state('about', route.resolve('/about', 'about'))
                .state('contact-us', route.resolve('/contact-us', 'contact-us'))
                .state('forgot-password', route.resolve('/forgot-password', 'auth/forgot-password'))
                .state('reset-password', route.resolve('/reset-password/:change_password_token/:email', 'auth/reset-password'))
                .state('registration', route.resolve('/registration', 'auth/registration'))
                .state('login', route.resolve('/login', 'auth/login'))

                //LoggedIN
                .state('account-settings', route.resolve('/account-settings', 'account-settings'))
                .state('dashboard', route.resolve('/dashboard', 'dashboard'))
                .state('workouts', route.resolve('/workouts', 'workouts'))
                .state('workouts.video', route.resolve('/:id', 'workouts'))
                .state('fitness-professional', route.resolve('/fitness-professional', 'fitness-professional'))
                .state('change-password', route.resolve('/change-password', 'auth/change-password'))
                .state('logout', route.resolve('/logout', 'auth/logout'));

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
            if (error.data['detail'] == 'Invalid token') {
                window.location = '/#/logout';
            }
        }
    }]);

    app.controller('NavCtrl', ['localStorageService', '$scope', 
        function(localStorageService, $scope) {
            $scope.isCollapsed = true;
            $scope.token = localStorageService.get('Authorization');
            $scope.templateNav = {
                url: 'navbar/index.html'
            };
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


    //Bootstrap Angular
    angularAMD.bootstrap(app);


    return app;
});