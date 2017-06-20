(function () {

    'use strict';

    angular.module('nodeWebApp').factory('eventService', eventService);

    eventService.$inject = ['$http', '$q', '$state', 'baseUrl', 'toastr'];

    function eventService($http, $q, $state, baseUrl, toastr) {

        return {
            getEventsPage: getEventsPage,
            getEvent: getEvent
        };

        function getEventsPage (appId, page) {
            return $http.get(baseUrl + 'api/events/' + appId + '?page=' + page)
                .then(getEventsPageSuccess)
                .catch(getEventsPageError);

            function getEventsPageSuccess (response) {
                return response.data;
            }
            function getEventsPageError (e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }
        }

        function getEvent (eventId) {
            return $http.get(baseUrl + 'api/events/one/' + eventId)
                .then(getEventSuccess)
                .catch(getEventError);

            function getEventSuccess(response) {
                return response.data;
            }
            function getEventError(e) {
                toastr.error(e.data.message);
                return $q.reject(e);
            }
        }
    }
})();
