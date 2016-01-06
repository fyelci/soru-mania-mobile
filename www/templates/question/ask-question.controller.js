'use strict';

appControllers
    .controller('AskQuestionController', function ($scope, $state, $mdToast, $cordovaCamera, $mdBottomSheet, $cordovaImagePicker, LovType, Question, Principal, ImageUploadService) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Soru Sorma');
        }

        Principal.identity().then(function(account) {
            $scope.account = account;
        });

        $scope.resetParams = function () {
            $scope.question = {};
            $scope.selectedLesson = {};
            $scope.selectedCategory = {};
            $scope.imgURI = undefined;
        }

        $scope.initPage = function () {
            $scope.categories = LovType.get({type:'CATEGORY'});
            $scope.resetParams();
        };

        $scope.categorySelected = function (selectedCategory) {
            $scope.lessons = LovType.get({type:'LESSON'});
        };

        $scope.askQuestion = function () {
            var hasError = false;
            var errorMessage = '';
            if(!$scope.selectedCategory.id) {
                hasError = true;
                errorMessage = 'Sınav Seçiniz!';
            } else if(!$scope.selectedLesson.id) {
                hasError = true;
                errorMessage = 'Ders Seçiniz!';
            } else if(!$scope.imgURI) {
                hasError = true;
                errorMessage = 'Sorunun resmini çekiniz!';
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
                $scope.question.userId = $scope.account.id;
                $scope.question.categoryId = $scope.selectedCategory.id.id;
                $scope.question.lessonId = $scope.selectedLesson.id.id;

                var uploadOptions = {
                    params : { 'folder': $scope.selectedCategory.id.name,
                                tags: $scope.selectedCategory.id.name +  ',' + $scope.selectedLesson.id.name + ',' + $scope.account.login}
                };

                ImageUploadService.uploadImage($scope.imgURI, uploadOptions).then(
                    function(result) {

                        var url = result.secure_url || '';

                        //var urlSmall;
                        //if(result && result.eager[0]) urlSmall = result.eager[0].secure_url || '';

                        $scope.question.mediaUrl = url;
                        if ($scope.question.id != null) {
                            Question.update($scope.question, onSaveSuccess, onSaveError);
                        } else {
                            Question.save($scope.question, onSaveSuccess, onSaveError);
                        }

                        $cordovaCamera.cleanup();

                    },
                    function(err) {
                        // Do something with the error here
                        console.log('Error when uploading image');
                        console.log(err);
                        $cordovaCamera.cleanup();

                    }
                );

            }
        };

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $scope.resetParams();
            $state.go('app.home' , {message: 'Sorunuz Başarılı Bir Şekilde Kaydedildi!'});
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


        $scope.initPage();
    });
