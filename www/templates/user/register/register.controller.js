'use strict';

appControllers
    .controller('RegisterController', function ($scope, $state, $timeout, $mdToast, Auth) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Yeni Kayıt Ekranı');
        }

        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.registerAccount = {};
        //$timeout(function (){angular.element('[ng-model="registerAccount.login"]').focus();});

        $scope.register = function () {
            $scope.registerAccount.langKey =  'tr' ;
            $scope.doNotMatch = null;
            $scope.error = null;
            $scope.errorUserExists = null;
            $scope.errorEmailExists = null;

            Auth.createAccount($scope.registerAccount).then(function () {
                $scope.success = 'OK';

                // Showing toast for register success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 4000,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Kayıt işleminiz başarıyla gerçekleşti, giriş yapabilirsiniz!"
                        }
                    }
                });//End showing toast.
                $state.go('app.login');

            }).catch(function (response) {
                console.log('Register Error: ');
                console.log(JSON.stringify(response));
                $scope.success = null;
                var message;
                if (response.status === 400 && response.data === 'login already in use') {
                    message = 'Bu kullanıcı adı ile başka bir kullanıcı mevcut. Lütfen başka bir kullanıcı adı deneyin.';
                } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                    message = 'Bu mail adresi zaten kullanılıyor. Lütfen başka bir mail deneyin!';
                } else {
                    message = 'Kayıt işlemi sırasında hata oluştu, lütfen tekrar deneyin!';
                }

                // Showing toast for error.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 4000,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: message
                        }
                    }
                });//End showing toast.
            });
        };
    });
