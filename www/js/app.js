// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('hdrApp', ['ionic', 'hdrFilters', 'ngCordova'])

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.views.transition('android');
        $ionicConfigProvider.form.checkbox('square');
        //$ionicConfigProvider.form.toggle('large');

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];


        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'views/tabs.html'
            })
            // Each tab has its own nav history stack:
            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'views/home/view.html',
                        controller: 'HomeController'
                    }
                }
            }).state('tab.classrooms', {
                url: '/classrooms',
                views: {
                    'tab-classrooms': {
                        templateUrl: 'views/classrooms/view.html',
                        controller: 'ClassroomsController'
                    }
                }
            })
            .state('tab.classroom', {
                url: '/classrooms/classroom',
                params: { 'classroom_title': null },
                views: {
                    'tab-classrooms': {
                        templateUrl: 'views/classrooms/classroom/view.html',
                        controller: 'ClassroomController'
                    }
                }
            })
            .state('tab.student', {
                url: '/student',
                params: { 'student': null, 'classroom': null },
                cache: false,
                views: {
                    'tab-student': {
                        templateUrl: 'views/classrooms/classroom/student/view.html',
                        controller: 'StudentController'
                    }
                }
            })
            .state('tab.appeal', {
                url: '/classrooms/appeal',
                params: { classroom: null, index: null },
                views: {
                    'tab-classrooms': {
                        templateUrl: 'views/classrooms/appeal/view.html',
                        controller: 'AppealController'
                    }
                }
            })
            .state('tab.sessionshistory', {
                url: '/sessionshistory',
                cache: true,
                views: {
                    'tab-sessionshistory': {
                        templateUrl: 'views/sessionshistory/view.html',
                        controller: 'SessionshistoryController'
                    }
                }
            })
            .state('tab.sessionalter', {
                url: '/sessionshistory/sessionalter',
                params: { session_view: null },
                cache: true,
                views: {
                    'tab-sessionshistory': {
                        templateUrl: 'views/sessionshistory/sessionalter/view.html',
                        controller: 'SessionalterController'
                    }
                }
            })

            .state('tab.teacher', {
                url: '/teacher',
                views: {
                    'tab-teacher': {
                        templateUrl: 'views/teacher/view.html',
                        controller: 'TeacherController'
                    }
                }
            })
            .state('tab.search', {
                url: '/search',
                views: {
                    'tab-search': {
                        templateUrl: 'views/search/view.html',
                        controller: 'SearchController'
                    }
                }
            })

            .state('tab.user', {
                url: '/user',
                views: {
                    'tab-user': {
                        templateUrl: 'views/user/view.html',
                        controller: 'UserController'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/home');
    })




    .run(function ($ionicPlatform) {

        $ionicPlatform.ready(function () {
            if (ionic.Platform.isWebView()) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
                navigator.splashscreen.hide();
            }
        });


    });
