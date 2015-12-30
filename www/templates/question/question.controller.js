'use strict';

appControllers
    .controller('QuestionController', function ($scope, $state, $mdToast, $mdBottomSheet, $timeout, $stateParams, Question) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Soru Detay Sayfası');
        }

        $scope.initialForm = function () {
            if ($scope.isAndroid) {
                jQuery('#product-detail-loading-progress').show();
            }
            else {
                jQuery('#product-detail-loading-progress').fadeIn(700);
            }

            Question.get({id: $stateParams.id}, function(result) {
                $scope.question = result;

                jQuery('#product-detail-loading-progress').hide();
                jQuery('#product-detail-content').fadeIn();
            });
        };

        // sharedProduct fro show shared social bottom sheet by calling sharedSocialBottomSheetCtrl controller.
        $scope.sharedProduct = function ($event, product) {
            $mdBottomSheet.show({
                templateUrl: 'bottom-sheet-shared.html',
                controller: 'sharedSocialBottomSheetCtrl',
                targetEvent: $event,
                locals: {
                    product: product
                }
            });
        };// End sharedProduct.


        $scope.answerQuestion = function () {
            $state.go('app.comment', {question: $scope.question, questionId: $scope.question.id});
        };

        $scope.replyToComment = function (comment) {
            $state.go('app.comment-reply', {question: $scope.question, comment: comment});
        };

        $scope.initialForm();

    });
