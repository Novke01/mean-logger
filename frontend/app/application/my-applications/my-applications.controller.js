(function () {

    'use strict';

    angular.module('nodeWebApp').controller('MyApplicationsController', MyApplicationsController);

    MyApplicationsController.$inject = ['applicationService'];

    function MyApplicationsController (applicationService) {

        var vm = this;

        vm.myApps = [];
        vm.totalItems = 0;
        vm.pageSize = 20;
        vm.currentPage = 1;
        vm.pageChanged = pageChanged;

        activate();

        function activate () {
            getAppsPage(vm.currentPage);
        }

        function getAppsPage (page) {
            applicationService.getAppsPage(page - 1)
                              .then(setAppsPage);
        }

        function setAppsPage (myAppsPage) {
            vm.myApps = myAppsPage.page;
            vm.pageSize = myAppsPage.pageSize;
            vm.totalItems = myAppsPage.total;
        }

        function pageChanged () {
            getAppsPage(vm.currentPage);
        }

    }

})();