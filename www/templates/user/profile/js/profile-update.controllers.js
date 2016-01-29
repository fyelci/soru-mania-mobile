
appControllers.controller('profileUpdateCtrl', function ($rootScope, $scope, $mdToast, $state, $cordovaImagePicker, $cordovaCamera, Principal, Auth, LovType, ImageUploadService) {

    //Google Analytics
    if(typeof analytics !== 'undefined') {
        analytics.trackView('Profil Güncelleme');
    }

    $scope.success = null;
    $scope.error = null;
    $scope.imgURI = undefined;


    $scope.initPage = function () {
        $scope.preparingFors = LovType.get({type:'CATEGORY'});
        $scope.userGraduateStatuses = LovType.get({type:'USER_GRADUATE_STATUS'});
        $scope.userTypes = LovType.get({type:'USER_TYPE'});

        Principal.identity().then(function(account) {
            $scope.settingsAccount = copyAccount(account);
        });
    };

    $scope.save = function () {

        var errorMessage = undefined;
        if(!$scope.settingsAccount.firstName) {
            errorMessage = 'İsim zorunludur';
        }
        if(!$scope.settingsAccount.lastName) {
            errorMessage = 'Soyisim zorunludur';
        }
        if(errorMessage) {
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1000,
                position: 'top',
                locals: {
                    displayOption: {
                        title: errorMessage
                    }
                }
            });
            return;
        }


        //Kullanıcı resmini güncellemişse resmi de güncelle, yoksa sadece diğer bilgileri güncelle.
        if(!$scope.imgURI) {
            $scope.updateAccountInfo();
        } else {
            var uploadOptions = {
                params : { 'folder': 'profile',
                    tags: 'profile,' + $scope.settingsAccount.login}
            };

            ImageUploadService.uploadImage($scope.imgURI, uploadOptions).then(
                function(result) {
                    var url = result.secure_url || '';

                    $scope.settingsAccount.profileImageUrl = url;
                    $scope.updateAccountInfo();

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

    $scope.updateAccountInfo = function () {
        Auth.updateAccount($scope.settingsAccount).then(function() {
            $scope.error = null;
            $scope.success = 'OK';
            Principal.identity(true).then(function(account) {
                $scope.settingsAccount = copyAccount(account);
                $rootScope.$broadcast('userAccountUpdateSuccess');
                $state.go('app.profile', {username: $scope.settingsAccount.login, message: 'Bilgileriniz Güncellenmiştir.'});
            });
        }).catch(function() {
            $scope.success = null;
            $scope.error = 'ERROR';
        });
    }

    // selectImage is for select image from mobile gallery
    $scope.selectImage = function () {
        var options = {
            maximumImagesCount: 1,
            width: 300,
            height: 300,
            quality: 50
        };

        // select image by calling $cordovaImagePicker.getPictures(options)
        $cordovaImagePicker.getPictures(options)
            .then(function (results) {
                // store image data to imageList.
                $scope.imgURI = undefined;
                for (var i = 0; i < results.length; i++) {
                    $scope.imgURI = results[i]
                    $scope.settingsAccount.profileImageUrl = $scope.imgURI;
                }
            }, function (error) {
                console.log(error);
            });
    };// End selectImage.

    /**
     * Store the "settings account" in a separate variable, and not in the shared "account" variable.
     */
    var copyAccount = function (account) {
        return {
            firstName: account.firstName,
            lastName: account.lastName,
            login: account.login,
            email: account.email,
            profileImageUrl: account.profileImageUrl,
            preparingForId: account.preparingForId,
            userGraduateStatusId: account.userGraduateStatusId,
            userTypeId: account.userTypeId,
            userTarget: account.userTarget
        }
    }

    $scope.initPage();

});