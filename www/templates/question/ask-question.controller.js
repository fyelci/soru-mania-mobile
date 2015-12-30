'use strict';

appControllers
    .controller('AskQuestionController', function ($scope, $rootScope, $state, $stateParams, $mdToast, $cordovaCamera, LovType, Question, Principal, ImageUploadService) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Soru Sorma');
        }

        Principal.identity().then(function(account) {
            $scope.account = account;
        });

        $scope.question = {};
        $scope.selectedLesson = {};
        $scope.selectedCategory = {};

        $scope.initPage = function () {
            $scope.categories = LovType.get({type:'CATEGORY'});
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
            } else if(!$scope.question.detail && !$scope.imgURI) {
                hasError = true;
                errorMessage = 'Sorunun resmini çekin, ya da açıklama girin!';
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
            $scope.question = {};
            $state.go('app.home' , {message: 'Sorunuz Başarılı Bir Şekilde Kaydedildi!'});
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.initPage();


        $scope.takePicture = function() {
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
    });
