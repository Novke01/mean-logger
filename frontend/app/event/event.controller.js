(function(){
    'use strict';

    angular.module('nodeWebApp').controller('EventController', EventController);

    EventController.$inject = ['eventService', 'commentService', 'userService', '$stateParams', '$log', 'toastr'];

    function EventController(eventService, commentService, userService, $stateParams, $log, toastr) {

        var vm = this;
        vm.event = {
            _id: $stateParams.id
        };
        vm.newComment = {
            text: ''
        };
        vm.comments = [];
        vm.totalItems = 0;
        vm.pageSize = 20;
        vm.currentPage = 1;
        vm.pageChanged = pageChanged;
        vm.createComment = createComment;

        activate();

        function activate () {
            eventService.getEvent(vm.event._id).then(setEvent);
        }

        function pageChanged () {
            commentService.getComments(vm.event._id, vm.currentPage - 1)
                          .then(setComments);
        }

        function setEvent (event) {
            vm.event = event;
            commentService.getComments(vm.event._id, vm.currentPage - 1)
                          .then(setComments);
        }

        function setComments (response) {
            vm.comments = response.page;
            vm.totalItems = response.total;
            vm.pageSize = response.pageSize;
        }

        function createComment () {
            commentService.createComment({
                eventId: vm.event._id,
                comment: vm.newComment
            })
            .then(addComment);
        }

        function addComment (response) {
            $log.log(userService);
            response.user = {
                _id: response.user,
                email: userService.getLoggedInUser().email
            };
            if (vm.comments.length > 19) {
                vm.totalItems++;
                vm.comments.splice(-1, 1);
            }
            vm.comments.unshift(response);
        }

    }

})();
