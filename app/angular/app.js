/*######################################################
 This app returns a ng module which is declared to
 be the main module for the entire app.

 Logic can be applied to set up the home page
 ######################################################*/
'use strict';
define(['angularAMD',
        'uiRouter',
        'geolocation',
        'uiBootstrap',
        'routeResolver',
        'angularResource',
        'angularLocalStorage',
        'autoFillEvent',
        'jquery',
        'jqueryui',
        'fullcalendar',
        'ui.calendar',
        'ui.utils',
        'ngTagsInput',
        'underscore',
        'angular-google-maps',
        'stripeJS',
        'stripe',
        "xeditable",
        'jcrop',
        'angularFileUpload',
        'bootstrap.wysihtml5.en-US',
        'socialShare',
        'mention',
        'caret',
        'angular-animate',
        'toasterjs',
        'bootstrap-typeahead'
    ],
    function (angularAMD) {
        'use strict';
        var app = angular.module('app', [
            'ui.router',
            'ui.route',
            'ui.bootstrap',
            'ui.bootstrap.datepicker',
            'ngTagsInput',
            'ui.bootstrap.timepicker',
            'ui.bootstrap.modal',
            'ui.bootstrap.carousel',
            'routeResolverServices',
            'ngResource',
            'LocalStorageModule',
            'ui.calendar',
            'ui.bootstrap.tabs',
            'ui.bootstrap.pagination',
            'google-maps',
            'xeditable',
            'toaster',
            'geolocation',
            'angularFileUpload',
            'td.easySocialShare'
        ]);

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
                    .state('home.entry', route.resolve('entry/:id', 'home'))
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
                    .state('messages.view.reply', route.resolve('/reply/:recipient', 'messages'))
                    .state('messages.view.detail', route.resolve('/:index', 'messages'))
                    .state('workouts', route.resolve('/workouts', 'workouts'))
                    .state('workouts.video', route.resolve('/:id', 'workouts'))
                    .state('fitness-professionals', route.resolve('/fitness-professionals', 'fitness-professionals'))
                    .state('evergreen', route.resolve('/evergreen', 'evergreen'))
                    .state('change-password', route.resolve('/change-password', 'auth/change-password'))
                    .state('terms', route.resolve('/terms', 'terms'))
                    .state('faq', route.resolve('/faq', 'faq'))
                    .state('membership', route.resolve('/membership', 'membership'))
                    .state('calendar', route.resolve('/calendar', 'calendar'))
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
        app.service('tokenError', ['localStorageService', '$rootScope', function (localStorageService, $rootScope) {
            $rootScope.checkTokenError = function (error) {
                if (error.data && error.data['detail'] == 'Invalid token') {
                    localStorageService.clearAll();
                    window.location = "/";
                }
            }
        }]);


        app.controller('NavCtrl', ['localStorageService', '$resource', '$state', '$timeout', '$scope', 'toaster', 'rest',
            function (localStorageService, $resource, $state, $timeout, $scope, toaster) {
                $scope.isCollapsed = true;
                $scope.token = localStorageService.get('Authorization');
                $scope.user_type = localStorageService.get('user_type');

                var notificationsResource = $resource(":protocol://:url/notifications/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {update: { method: 'PUT' }});
                var notificationsIdResource = $resource(":protocol://:url/notifications/:id", {
                    id: '@id',
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {update: { method: 'PUT' }});

                (function tick() {
                    $scope.notifications = notificationsResource.get(function () {
                        $scope.notificationsCount = $scope.notifications.count;
                        $timeout(tick, 30000);
                    });
                })();

                if ($scope.token) {
                    $scope.templateNav = {
                        url: 'navbar/index.html'
                    };
                    $scope.signOut = function () {
                        localStorageService.clearAll();
                        window.location = "/";
                    }
                }
                ;

                $scope.pop = function () {
                    angular.forEach($scope.notifications.results, function (value, key) {
                        toaster.pop(value.level, value.level, value.message);
                        $scope.notificationsCallback = notificationsIdResource.update({id: value.id}, function () {
                        });
                    });
                    $scope.notificationsCount = 0;
                };
            }]);


        app.controller('PageCtrl', ['localStorageService', '$scope',
            function (localStorageService, $scope) {
                $scope.token = localStorageService.get('Authorization');
            }]);
        app.controller('footerCtrl', ['localStorageService', '$scope',
            function (localStorageService, $scope) {
                $scope.isCollapsed = true;
                $scope.token = localStorageService.get('Authorization');
                $scope.templateNav = {
                    url: 'footer/index.html'
                };
            }]);
        app.directive('ng-blur', function () {
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
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                });
            };
        });
        app.directive('richTextEditor', function () {
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
        app.directive('ngInput', ['$resource', 'rest', function ($resource) {
            return {
                restrict: 'A', // only activate on element attribute
                require: '?ngModel', // get a hold of NgModelController
                link: function (scope, element, attrs, ngModel) {
                    if (!ngModel) return; // do nothing if no ng-model

                    // Feed Typeahead
                    var mentionCollection = $resource("http://:url/feed/typeahead", {
                        url: scope.restURL
                    });
                    mentionCollection.get(function (mentions) {
                        scope.mentions = mentions.results;
                        element.mention({
                            delimiter: '@',
                            queryBy: ['name'],
                            emptyQuery: true,
                            users: scope.mentions,
                            typeaheadOpts: {
                                items: 8 // Max number of items you want to show
                            }
                        });
                    });

                    // Specify how UI should be updated
                    ngModel.$render = function () {
                        element.html(ngModel.$viewValue || '');
                    };

                    // Listen for change events to enable binding
                    element.on('blur keyup change', function (e) {
                        scope.$apply(readViewText);
                    });

                    // Write data to the model
                    function readViewText() {
                        //var html = element.val();
                        // Top line works for input and text area
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
        }]);
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
                    scope.$apply(function () {
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