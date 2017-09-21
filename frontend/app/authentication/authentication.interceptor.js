(function () {

    'use strict';

    var app = angular.module('nodeWebApp');

    app.factory('authenticationInterceptor', authenticationInterceptor);

    authenticationInterceptor.$inject = ['$cookies'];

    function authenticationInterceptor ($cookies) {

        return {
            request: request
        };

        function request (config) {
            config.headers = config.headers || {};
            if ($cookies.get('access-token')) {
                config.headers['X-Auth-Token'] = $cookies.get('access-token');
            }
            return config;
        }

    }

    app.config(addAuthenticationInterceptor);

    addAuthenticationInterceptor.$inject = ['$httpProvider'];

    function addAuthenticationInterceptor ($httpProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');
    }


})();