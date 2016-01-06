'use strict';

appControllers
    .controller('QuestionController', function ($scope, $state, $stateParams, $mdToast, $mdBottomSheet, $timeout, Question) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Soru Detay Sayfası');
        }

        if($stateParams.message) {
            // Showing toast for error.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 2000,
                position: 'top',
                locals: {
                    displayOption: {
                        title: $stateParams.message
                    }
                }
            });//End showing toast.

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
            console.log('Answer Question ID:' + $scope.question.id);
            console.log($scope.question);
            $state.go('app.comment', {question: $scope.question, questionId: $scope.question.id});
        };

        $scope.replyToComment = function (comment) {
            $state.go('app.comment-reply', {question: $scope.question, comment: comment});
        };

        $scope.initialForm();

    });
