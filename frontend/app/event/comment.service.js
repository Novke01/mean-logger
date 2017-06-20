(function(){
    'use strict';

    angular.module('nodeWebApp').factory('commentService', commentService);
    
    commentService.$inject = ['$http', '$q', 'toastr', 'baseUrl'];

    function commentService ($http, $q, toastr, baseUrl) {

        return {
            createComment: createComment,
            replyComment: replyComment,
            getComments: getComments
        };

        function createComment (comment) {
            return $http.post(baseUrl + 'api/comments', comment)
                        .then(createCommentSuccess)
                        .catch(createCommentError);

            function createCommentSuccess (response) {
                return response.data;
            }

            function createCommentError (error) {
                toastr.error(error.data.message);
                return $q.reject(error);
            }

        }

        function replyComment (reply) {
            return $http.post(baseUrl + 'api/comments/reply', reply)
                        .then();
        }

        function getComments (eventId, page) {
            return $http.get(baseUrl + 'api/comments/' + eventId + '?page=' + page)
                        .then(getCommentsSuccess)
                        .catch(getCommentsError);

            function getCommentsSuccess (response) {
                return response.data;
            }

            function getCommentsError (error) {
                toastr.error(error.data.message);
                return $q.reject(error);
            }

        }

    }

})();
