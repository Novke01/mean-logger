(function () {

    'use strict';

    angular.module('nodeWebApp').config(configureApp);

    configureApp.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

    function configureApp ($stateProvider, $locationProvider, $urlRouterProvider) {

        $locationProvider.hashPrefix('');

        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'header/header.template.html',
                        controller: 'HeaderController',
                        controllerAs: 'header'
                    },
                    'content': {},
                    'footer': {
                        templateUrl: 'footer/footer.template.html',
                        controller: 'FooterController',
                        controllerAs: 'footer'
                    }
                }
            })
            .state('app.loginRegistration', {
                url: 'login-registration',
                views: {
                    'header@': {},
                    'footer@': {},
                    'content@': {
                        templateUrl: 'login-registration/login-registration.template.html',
                        controller: 'LoginRegistrationController',
                        controllerAs: 'logreg'
                    },
                    'login@app.loginRegistration': {
                        templateUrl: 'login-registration/login/login.template.html',
                        controller: 'LoginController',
                        controllerAs: 'login'
                    },
                    'registration@app.loginRegistration': {
                        templateUrl: 'login-registration/registration/registration.template.html',
                        controller: 'RegistrationController',
                        controllerAs: 'registration'
                    }
                }
            })
            .state('app.myApplications', {
                url: 'my-applications',
                views: {
                    'content@': {
                        templateUrl: 'application/my-applications/my-applications.template.html',
                        controller: 'MyApplicationsController',
                        controllerAs: 'myApps'
                    }
                }
            })
            .state('app.newApplication', {
                url: 'new-application',
                views: {
                    'content@': {
                        templateUrl: 'application/new-application/new-application.template.html',
                        controller: 'NewApplicationController',
                        controllerAs: 'newApp'
                    }
                }
            })
            .state('app.application', {
                url: 'application/:id',
                views: {
                    'content@': {
                        templateUrl: 'application/application/application.template.html',
                        controller: 'ApplicationController',
                        controllerAs: 'app'
                    }
                }
            })
            .state('app.event', {
                url: 'event/:id',
                views: {
                    'content@': {
                        templateUrl: 'event/event.template.html',
                        controller: 'EventController',
                        controllerAs: 'event'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

    }

})();
