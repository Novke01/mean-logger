(function () {

    'use strict';

    angular.module('nodeWebApp').controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = ['$state', 'applicationService', 'eventService'];

    function ApplicationController($state, applicationService, eventService) {

        var vm = this;

        vm.app = {};
        vm.events = [];
        vm.currentPage = 1;
        vm.totalItems = 0;
        vm.pageSize = 20;
        vm.newUser = {
            email: ''
        };
        vm.addUser = addUser;
        vm.pageChanged = pageChanged;

        activate();

        function activate() {
            applicationService.getApplication($state.params.id)
                              .then(setApp);
        }

        function setApp(app) {
            vm.app = app;
            vm.newUser.appId = app._id;
            getEventsPage();
        }

        function addUser () {
            applicationService.addUserToApp(vm.newUser)
                              .then(addUserToList);
        }

        function addUserToList (response) {
            vm.app.users.push(response);
        }
        
        function getEventsPage () {
            eventService.getEventsPage(vm.app._id, vm.currentPage - 1).then(setEventsPage);
        }

        function setEventsPage (result) {
            vm.events = result.page;
            vm.totalItems = result.total;
            vm.pageSize = result.pageSize;
        }

        function pageChanged () {
            getEventsPage(vm.currentPage);
        }

    }

})();