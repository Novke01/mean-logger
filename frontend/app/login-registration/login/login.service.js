(function () {

    'use strict';

    angular.module('nodeWebApp').factory('loginService', loginService);

    loginService.$inject = ['$http', '$q', '$cookies', '$state', 'toastr', 'jwtHelper', 'baseUrl', 'userService'];

    function loginService ($http, $q, $cookies, $state, toastr, jwtHelper, baseUrl, userService) {

        return {
            login: login,
            refreshToken: refreshToken,
            logout: logout
        };

        function login (loginUser) {

            return $http.post(baseUrl + 'api/users/login', loginUser)
                        .then(loginSuccess)
                        .catch(loginFail);

            function loginSuccess (response) {

                var accessToken = response.data['access-token'];
                var refreshToken = response.data['refresh-token'];

                $cookies.put('access-token', accessToken);
                $cookies.put('refresh-token', refreshToken);
                var loggedInUser = jwtHelper.decodeToken(accessToken);
                userService.setLoggedInUser(loggedInUser);
                $state.go('app.myApplications');
                
                toastr.success('Hello ' + loggedInUser.firstName + ' ' + loggedInUser.lastName + '!', 'Log In successful!');

            }

            function loginFail (e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }

        }

        function refreshToken (refToken) {
            return $http.post(baseUrl + 'api/users/refresh-token', refToken)
                        .then(refreshTokenSuccess)
                        .catch(refreshTokenFail);

            function refreshTokenSuccess (response) {
                var accessToken = response.data['access-token'];
                $cookies.put('access-token', accessToken);
            }

            function refreshTokenFail (e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }

        }

        function logout () {

            userService.setLoggedInUser({});
            $cookies.remove('access-token');
            $cookies.remove('refresh-token');
            $state.go('app.loginRegistration');

        }

    }

    

})();