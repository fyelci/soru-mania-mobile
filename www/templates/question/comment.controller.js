'use strict';

appControllers
    .controller('CommentController', function ($scope, $state, $stateParams, Question) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Cevaplama Sayfası');
        }

        if($stateParams.question) {
            $scope.question = $stateParams.question;
        } else {
            Question.get({id: $stateParams.questionId}, function(result) {
                $scope.question = result;
            });
        }

        $scope.saveAnswer = function () {

        };


    });
