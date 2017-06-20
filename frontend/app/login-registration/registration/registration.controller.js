(function () {

    'use strict';

    angular.module('nodeWebApp').controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['registrationService'];

    function RegistrationController (registrationService) {

        var vm = this;

        vm.newUser = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };

        vm.signUp = signUp;

        function signUp () {
            registrationService.register(vm.newUser);
        }

    }

})();