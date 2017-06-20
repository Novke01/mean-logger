(function () {

    'use strict';

    angular.module('nodeWebApp').run(authenticationRunBlock);

    authenticationRunBlock.$inject = ['$rootScope', '$cookies', '$state', 'jwtHelper', 'userService', '$log'];

    function authenticationRunBlock ($rootScope, $cookies, $state, jwtHelper, userService, $log) {

        $rootScope.$on('$stateChangeStart', onStateChangeStart);

        function onStateChangeStart (event, toState) {

            var token = $cookies.get('access-token');

            if (token !== undefined) {
                var tokenData = jwtHelper.decodeToken(token);
                userService.setLoggedInUser(tokenData);
            }

            var publicPages = ['app.loginRegistration'];
            var restrictedPage = publicPages.indexOf(toState.name) === -1;
      
            if (restrictedPage && !($cookies.get('access-token') && $cookies.get('refresh-token'))) {
                event.preventDefault();
                $log.log('app.loginRegistration');
                $state.go('app.loginRegistration');
            }
            $log.log('app.myApps');

        }

    }

})();