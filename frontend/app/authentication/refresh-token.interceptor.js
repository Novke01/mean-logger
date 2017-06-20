(function () {

    'use strict';

    var app = angular.module('nodeWebApp');

    app.factory('refreshTokenInterceptor', refreshTokenInterceptor);

    refreshTokenInterceptor.$inject = ['$cookies', '$q', '$injector', 'jwtHelper'];

    function refreshTokenInterceptor ($cookies, $q, $injector, jwtHelper) {

        return {
            request: request
        };

        function request(config) {

            config.headers = config.headers || {};
            var currentToken = config.headers['X-Auth-Token'];

            if (currentToken !== undefined) {

                var loginService = $injector.get('loginService');
                var tokenData = jwtHelper.decodeToken(currentToken);
                var currentTime = new Date().getTime() / 1000;

                if (tokenData.exp < currentTime) {        
                    var refreshToken = $cookies.get('refresh-token');

                    if (refreshToken !== undefined) {
                        $cookies.remove('access-token');

                        return loginService.refreshToken({
                            refreshToken: refreshToken
                        }).then(setAccessToken);
                    }
                }
            }

            return config;

            function setAccessToken (response) {
                config.headers['X-Auth-Token'] = $cookies.get('access-token');
                return config;
            }

        }

    }

    app.config(addRefreshTokenInterceptor);

    addRefreshTokenInterceptor.$inject = ['$httpProvider'];

    function addRefreshTokenInterceptor ($httpProvider) {
        $httpProvider.interceptors.push('refreshTokenInterceptor');
    }

})();