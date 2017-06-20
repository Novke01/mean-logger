(function () {

    'use strict';

    angular.module('nodeWebApp').controller('LoginController', LoginController);

    LoginController.$inject = ['loginService'];

    function LoginController (loginService) {
        
        var vm = this;

        vm.user = {
            email: '',
            password: ''
        };

        vm.login = login;

        function login () {
            loginService.login(vm.user);
        }

    }

})();