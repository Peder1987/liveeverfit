/*######################################################
 Set up require.js
 require.js will ensure our dependancies are enforced (recommended by
 the creater of angular). This will allow ease for testing

 Documentation:

 baseUrl: self explanitory
 paths: attach an alias to a path
 Example: 'angular' : '/static/common/js/libs/angular/angular'
 which will look for /static/common/js/libs/angular/angular.js

 using the alias will force modules to make to load
 required alia(s) before doing any sort of code configuration
 Example:
 define(['app', 'angular','common/js/example' ], function(app) {
 ... } //javascript code in here

 app routes to the path /static/app/app.js
 since common/js/example isn't defined in paths
 then require.js will load /static/common/js/example.js
 one time, if example is used more than one place
 then it's better to give it a path

 deps: will initiate the startin depedancies which in term will
 start the real program boostrap.js

 this is a proper definition for shim.
 shim : Configure the dependencies, exports, and custom initialization for older,
 traditional "browser globals" scripts that do not use define() to declare the
 dependencies and set a module value.
 ######################################################*/

require.config({

    baseUrl: " ",

    paths: {
        'angular': 'common/angular/angular',
        'angularLocalStorage': 'common/angular-local-storage/angular-local-storage',
        'angularResource': 'common/angular-resource/angular-resource.min',
        'angularAMD': 'common/angularAMD/angularAMD',
        'ngload': 'common/angularAMD/ngload',
        'ngTagsInput': 'common/ng-tags-input/ng-tags-input',
        'uiRouter': 'common/angular-ui-router/release/angular-ui-router.min',
        'uiBootstrap': 'common/angular-bootstrap/ui-bootstrap.min',
        'routeResolver': 'common/router/routeResolver',
        'autoFillEvent': 'common/autofill-event/src/autofill-event',
        'jquery': 'common/jquery/jquery',
        'jqueryui': 'common/jquery-ui/ui/jquery-ui',
        'fullcalendar': 'common/fullcalendar/fullcalendar',
        'ui.calendar': 'common/angular-ui-calendar/src/calendar',
        'ui.utils': 'common/angular-ui-utils/ui-utils.min',
        'ui.bootstrap.datepicker': 'common/angular-bootstrap/datepicker/datepicker',
        'ui.bootstrap.timepicker': 'common/angular-bootstrap/timepicker/timepicker',
        'ui.bootstrap.modal': 'common/angular-bootstrap/modal/modal',
        'ui.bootstrap.tabs': 'common/angular-bootstrap/tabs/tabs',
        'ui.bootstrap.carousel': 'common/angular-bootstrap/carousel/carousel',
        'footer': 'footer/app',
        'videojs': 'common/videojs/dist/video-js/video',
        'stripe': 'common/stripe/angular-stripe-js',
        'stripeJS': 'common/stripe/stripe',
        'underscore': 'common/underscore/underscore',
        'angular-google-maps': 'common/angular-google-maps/dist/angular-google-maps',
        'xeditable' : 'common/angular-xeditable/dist/js/xeditable',
        'geolocation' : 'common/angularjs-geolocation/dist/angularjs-geolocation.min',
        'jcrop' : 'common/jcrop/js/jquery.Jcrop.min',
        'app' : 'app'

    },

    //Angular does not support AMD out of the box, put it in a shim
    shim: {
            'angular': {
                    exports: 'angular'
            },
            'angularAMD': ['angular'],
            "angularLocalStorage": ['angular'],
            "angularResource": ['angular'],
            "uiRouter": ['angular'],
            "uiBootstrap": ['angular'],
            "autoFillEvent": ['angular'],
            'ui.utils': ['angular'],
            'ui.calendar': ['angular'],
            'ui.bootstrap.datepicker': ['angular'],
            'ui.bootstrap.timepicker': ['angular'],
            'ui.bootstrap.modal': ['angular'],
            'ui.bootstrap.tabs': ['angular'],
            'ui.bootstrap.carousel': ['angular'],
            'ngTagsInput': ['angular'],
            'stripe': ['angular', "stripeJS"],
            'underscore': ['angular'],
            "jqueryui": ["jquery"],
            "fullcalendar": ["jquery"],
            'angular-google-maps': ['angular','underscore'],
            'footer': ['app'],
            'xeditable': ['angular'],
            'geolocation': ['angular'],
            'jcrop': ['jquery']
    },
    //Kick start application
    deps: ['app']
});
