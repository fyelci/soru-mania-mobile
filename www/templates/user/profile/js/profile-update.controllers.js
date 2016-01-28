
appControllers.controller('profileUpdateCtrl', function ($scope, $mdToast, $state, Principal, Auth, LovType) {

    //Google Analytics
    if(typeof analytics !== 'undefined') {
        analytics.trackView('Profil Güncelleme');
    }

    $scope.success = null;
    $scope.error = null;

    $scope.resetParams = function () {
        $scope.selectedPreparingFor = {};
        $scope.selectedUserGraduateStatus = {};
        $scope.selectedUsertype = {};
        $scope.imgURI = undefined;
    }

    $scope.initPage = function () {
        $scope.preparingFors = LovType.get({type:'CATEGORY'});
        $scope.userGraduateStatuses = LovType.get({type:'USER_GRADUATE_STATUS'});
        $scope.userTypes = LovType.get({type:'USER_TYPE'});

        $scope.resetParams();

        Principal.identity().then(function(account) {
            $scope.settingsAccount = copyAccount(account);

            $scope.selectedPreparingFor.id = $scope.settingsAccount.preparingForId;
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

        if ($scope.selectedPreparingFor && $scope.selectedPreparingFor.id) {
            $scope.settingsAccount.preparingForId = $scope.selectedPreparingFor.id.id;
        }
        if ($scope.selectedUserGraduateStatus && $scope.selectedUserGraduateStatus.id) {
            $scope.settingsAccount.userGraduateStatusId = $scope.selectedUserGraduateStatus.id.id;
        }
        if ($scope.selectedUsertype && $scope.selectedUsertype.id) {
            $scope.settingsAccount.userTypeId = $scope.selectedUsertype.id.id;
        }

        Auth.updateAccount($scope.settingsAccount).then(function() {
            $scope.error = null;
            $scope.success = 'OK';
            Principal.identity(true).then(function(account) {
                $scope.settingsAccount = copyAccount(account);
                $state.go('app.profile', {username: $scope.settingsAccount.login, message: 'Bilgileriniz Güncellenmiştir.'});
            });
        }).catch(function() {
            $scope.success = null;
            $scope.error = 'ERROR';
        });
    };

    /**
     * Store the "settings account" in a separate variable, and not in the shared "account" variable.
     */
    var copyAccount = function (account) {
        return {
            firstName: account.firstName,
            lastName: account.lastName,
            login: account.login,
            email: account.email,
            preparingForId: account.preparingForId,
            userGraduateStatusId: account.userGraduateStatusId,
            userTypeId: account.userTypeId,
            userTarget: account.userTarget
        }
    }

    $scope.initPage();

});