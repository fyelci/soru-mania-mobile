'use strict';

appControllers
    .controller('LoginController', function ($rootScope, $scope, $state, $timeout, $mdToast, Auth) {
        $scope.user = {};
        $scope.errors = {};

        console.log('Enter to LoginController.');

        $scope.rememberMe = true;
        //$timeout(function (){angular.element('[ng-model="username"]').focus();});
        $scope.login = function (event) {
            event.preventDefault();
            Auth.login({
                username: $scope.user.username,
                password: $scope.user.password,
                rememberMe: true
            }).then(function () {
                $scope.authenticationError = false;
                if ($rootScope.previousStateName === 'app.register') {
                    $state.go('app.home');
                } else {
                    $state.go('app.home');
                    //$rootScope.back();
                }

                $rootScope.$broadcast('userAuthSuccess');
            }).catch(function (response) {
                console.log('Login Error: ');
                console.log(JSON.stringify(response));

                $scope.authenticationError = true;

                // Showing toast for error.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 4000,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Giriş sırasında hata oluştu, lütfen kullanıcı bilgilerinizi kontrol ediniz!"
                        }
                    }
                });//End showing toast.
            });
        };
    });
