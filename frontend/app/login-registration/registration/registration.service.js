(function () {

    'use strict';

    angular.module('nodeWebApp').factory('registrationService', registrationService);

    registrationService.$inject = ['$http', '$q', 'toastr', 'baseUrl'];

    function registrationService ($http, $q, toastr, baseUrl) {

        return {
            register: register
        };

        function register (newUser) {
            return $http.post(baseUrl + 'api/users/register', newUser)
                        .then(registerSuccess)
                        .catch(registerFail);

            function registerSuccess (response) {
                toastr.success('User successfully registered!');
            }

            function registerFail (e) {
                return $q.reject(e);
            }

        }

    }

})();