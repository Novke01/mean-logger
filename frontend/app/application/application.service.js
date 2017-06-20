(function () {

    'use strict';

    angular.module('nodeWebApp').factory('applicationService', applicationService);

    applicationService.$inject = ['$http', '$q', '$state', 'baseUrl', 'toastr'];

    function applicationService($http, $q, $state, baseUrl, toastr) {

        return {
            registerApplication: registerApplication,
            getAppsPage: getAppsPage,
            getApplication: getApplication,
            getAllFragments: getAllFragments,
            getAllVersions: getAllVersions,
            addUserToApp: addUserToApp
        };

        function getAllFragments(app) {
            return $http.get(baseUrl + 'api/applications/' + app + "/get-all-fragments")
                .then(getAllFragmantsSuccess)
                .catch(getAllFragmantsError);

            function getAllFragmantsSuccess(response) {
                return response.data;
            }

            function getAllFragmantsError(e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }
        }

        function getAllVersions(app) {
            return $http.get(baseUrl + 'api/applications/' + app + "/get-all-versions")
                .then(getAllVersionsSuccess)
                .catch(getAllVersionsError);

            function getAllVersionsSuccess(response) {
                return response.data;
            }

            function getAllVersionsError(e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }
        }

        function registerApplication(newApp) {

            return $http.post(baseUrl + 'api/applications/create', newApp)
                .then(appRegistrationSuccess)
                .catch(appRegistrationFail);

            function appRegistrationSuccess(response) {
                toastr.success('Application successfully created!');
                $state.go('app.myApplications');
            }

            function appRegistrationFail(e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }

        }

        function getAppsPage(pageNo) {

            return $http.get(baseUrl + 'api/applications/my?page=' + pageNo)
                .then(getMyApplicationsSuccess)
                .catch(getMyApplicationsFail);

            function getMyApplicationsSuccess(response) {
                return response.data;
            }

            function getMyApplicationsFail(e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }

        }

        function getApplication(id) {

            return $http.get(baseUrl + 'api/applications/' + id)
                .then(getApplicationSuccess)
                .catch(getApplicationFail);

            function getApplicationSuccess(response) {
                return response.data;
            }

            function getApplicationFail(e) {
                return $q.reject(e);
            }

        }

        function addUserToApp (requestObj) {

            return $http.put(baseUrl + 'api/applications/add-user', requestObj)
                        .then(addUserToAppSuccess)
                        .catch(addUserToAppFail);

            function addUserToAppSuccess (response) {
                toastr.success('User successfully added to application.');
                return response.data;
            }

            function addUserToAppFail (e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }
        }
    }

})();