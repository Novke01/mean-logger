(function () {

    'use strict';

    angular.module('nodeWebApp').controller('NewApplicationController', NewApplicationController);

    NewApplicationController.$inject = ['applicationService'];

    function NewApplicationController (applicationService) {

        var vm = this;

        vm.newApp = {
            name: '',
            technology: '',
            version: '',
            repository: '',
            dsn: ''
        };

        vm.registerApp = registerApplication;

        function registerApplication () {
            applicationService.registerApplication(vm.newApp);
        }
        
    }

})();