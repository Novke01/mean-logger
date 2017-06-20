(function () {

    'use strict';

    angular.module('nodeWebApp').controller('HeaderController', HeaderController);

    HeaderController.$inject = ['loginService'];

    function HeaderController (loginService) {

        var vm = this;

        vm.isNavCollapsed = false;

        vm.logout = logout;
        
        function logout () {
            loginService.logout();
        }

    }

})();