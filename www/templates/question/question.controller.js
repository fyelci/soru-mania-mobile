'use strict';

appControllers
    .controller('QuestionController', function ($scope, $state, $stateParams, $mdToast, $mdBottomSheet, $timeout, $ionicModal, Question, QuestionRating, Principal, ReportedContent) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Soru Detay Sayfası');
        }

        Principal.identity().then(function(account) {
            $scope.account = account;
        });

        $scope.rating = {
            max: 5,
            rate: undefined
        };

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

                $scope.rating.rate = $scope.question.userRate;

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


        //Rating icin asagidaki plugin kullanildi.
        //https://github.com/fraserxu/ionic-rating
        $scope.$watch('rating.rate', function() {
            if($scope.question &&
                $scope.question.id
                && $scope.rating.rate != $scope.question.userRate) {
                var rateObj = {
                    userId: $scope.account.id,
                    questionId : $scope.question.id,
                    rate: $scope.rating.rate
                }
                QuestionRating.save(rateObj, onRateSuccess);
            }
        });

        var onRateSuccess = function(result) {
            $scope.question.rateAvg = result.rateAvg;
            $scope.question.rateCount = result.rateCount;

            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1000,
                position: 'top',
                locals: {
                    displayOption: {
                        title: 'Oyunuz alındı!'
                    }
                }
            });
        }

        //Resimleri tam ekran goster
        $scope.showQuestionImage = function(index) {
            $scope.showModal('templates/util/image-popover.html');
        }

        $scope.showCommentImages = function(index) {
            $scope.activeSlide = index;
            $scope.showModal('templates/util/comment-image-popover.html');
        }

        $scope.showModal = function(templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        // Close the modal
        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove()
        };

        // Report Start
        $scope.openReportDialog = function ($event, commentId) {
            $scope.reportedCommentId = commentId;
            $mdBottomSheet.show({
                templateUrl: 'ui-list-report-sheet-template',
                targetEvent: $event,
                scope: $scope.$new(false),
            });
        };

        $scope.reportContent = function (reportType) {
            var commentObj = undefined;
            if($scope.reportedCommentId) {
                commentObj = {id : $scope.reportedCommentId};
            }

            var reportedContent = {
                type : {id : reportType},
                question : {id : $scope.question.id},
                comment : commentObj,
                reporterUser : {id : $scope.account.id}
            }

            //TODO Save report
            ReportedContent.save(reportedContent, onReportSuccess);

            $scope.reportedCommentId = undefined;
            $mdBottomSheet.hide();
        }


        var onReportSuccess = function(result) {
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1000,
                position: 'top',
                locals: {
                    displayOption: {
                        title: 'Zararlı içeriği bildirdiğiniz için teşekkürler!'
                    }
                }
            });
        }
        //Report End

        $scope.goToUserProfile = function (username) {
            $state.go('app.profile' , {username: username});
        };

        $scope.initialForm();

    });
