(function () {

    'use strict';

    angular.module('nodeWebApp').factory('userService', userService);

    userService.$inject = [];

    function userService () {

        var loggedInUser = {};

        return {
            getLoggedInUser: getLoggedInUser,
            setLoggedInUser: setLoggedInUser
        };

        function getLoggedInUser () {
            return loggedInUser;
        }

        function setLoggedInUser (user) {
            loggedInUser = user;
        }

    }

})();