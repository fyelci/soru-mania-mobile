'use strict';

appControllers
    .controller('CommentController', function ($scope, $state, $stateParams, $mdToast, $cordovaCamera, $mdBottomSheet, $cordovaImagePicker, Principal, ImageUploadService, Comment, Question) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Cevaplama Sayfası');
        }

        Principal.identity().then(function(account) {
            $scope.account = account;
        });

        $scope.resetParams = function () {
            $scope.comment = {};
            $scope.imgURI = undefined;
        }

        $scope.resetParams();

        if($stateParams.question) {
            $scope.question = $stateParams.question;
        } else {
            Question.get({id: $stateParams.questionId}, function(result) {
                $scope.question = result;
            });
        }


        $scope.saveAnswer = function () {
            var hasError = false;
            var errorMessage = '';
            if(!$scope.imgURI && !$scope.comment.text) {
                hasError = true;
                errorMessage = 'Cevabın resmini yükleyin ya da yorum yapın!';
            }

            if(hasError) {
                // Showing toast for error.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 2000,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: errorMessage
                        }
                    }
                });//End showing toast.
            } else {
                //Gerekli tum alanlar girilmisse de soruyu kaydet.
                $scope.isSaving = true;
                $scope.comment.userId = $scope.account.id;
                $scope.comment.questionId = $scope.question.id

                var uploadOptions = {
                    params : { 'folder': $scope.question.categoryName + '/cevap',
                        tags: $scope.categoryName +  ',' + $scope.lessonName + ',' + $scope.account.login + ',cevap'}
                };

                if($scope.imgURI) {
                    ImageUploadService.uploadImage($scope.imgURI, uploadOptions).then(
                        function(result) {

                            var url = result.secure_url || '';

                            $scope.comment.mediaUrl = url;
                            Comment.save($scope.comment, onSaveSuccess, onSaveError);

                            $cordovaCamera.cleanup();
                        },
                        function(err) {
                            // Do something with the error here
                            console.log('Error when uploading image');
                            console.log(err);
                            $cordovaCamera.cleanup();

                        }
                    );
                } else {
                    //Resimsiz kaydetme secenegi
                    Comment.save($scope.comment, onSaveSuccess, onSaveError);
                }

            }
        };

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $scope.resetParams();
            $state.go('app.home', {message: 'Cevabınız Kaydedildi!'} );
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };



        $scope.takePicture = function() {
            $mdBottomSheet.hide();

            var options = {
                quality : 75,
                destinationType : Camera.DestinationType.FILE_URI,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 350,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(image) {
                // Camera.DestinationType.DATA_URI olsaydı bunu kullanacaktik. ama dokumantasyonda kullanmayin diyor
                //$scope.imgURI = "data:image/jpeg;base64," + imageData;
                $scope.imgURI = image;
            }, function(err) {
                console.log('Error when taking photo');
                console.log(err);
                // An error occured. Show a message to the user
            });
        }

        // selectImage is for select image from mobile gallery
        $scope.selectImage = function () {
            //hide BottomSheet.
            $mdBottomSheet.hide();
            var options = {
                maximumImagesCount: 1,
                width: 350,
                //height: 300,
                quality: 75
            };

            // select image by calling $cordovaImagePicker.getPictures(options)
            $cordovaImagePicker.getPictures(options)

                .then(function (results) {
                    // store image data to imageList.
                    $scope.imgURI = undefined;
                    for (var i = 0; i < results.length; i++) {
                        $scope.imgURI = results[i]
                    }
                }, function (error) {
                    console.log(error);
                });
        };// End selectImage.

        // showListBottomSheet for show BottomSheet.
        $scope.showListBottomSheet = function ($event) {
            $mdBottomSheet.show({
                templateUrl: 'image-picker-actions-template',
                targetEvent: $event,
                scope: $scope.$new(false),
            });
        }; // End showListBottomSheet.


    });
