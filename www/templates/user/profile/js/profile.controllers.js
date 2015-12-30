// Controller of expense dashboard page.
appControllers.controller('profileDashboardCtrl', function ($scope,$state,$stateParams, User) {

    //Google Analytics
    if(typeof analytics !== 'undefined') {
        analytics.trackView('Profil');
    }

    $scope.isAnimated =  true;

    $scope.initForm = function () {
        User.get({login: $stateParams.username}, function(result) {
            $scope.user = result;
        });
    }

    $scope.goToSetting = function () {
        $state.go("app.profileSetting");
    };

    $scope.initForm();

});// End of controller expense dashboard.

// Controller of expense dashboard setting.
appControllers.controller('profileDashboardSettingCtrl', function ($rootScope, $scope, $state,$ionicHistory,$ionicViewSwitcher, Auth) {

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go.
    // objectData = Object data will send to destination state.
    $scope.navigateTo = function (stateName,objectData) {
        if ($ionicHistory.currentStateName() != stateName) {
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });

            //Next view animate will display in back direction
            $ionicViewSwitcher.nextDirection('back');

            $state.go(stateName, {
                isAnimated: objectData,
            });
        }
    }; // End of navigateTo.

    $scope.logout = function () {
        Auth.logout();
        $rootScope.$broadcast('userLogoutSuccess');
        $state.go('app.home');
    };
}); // End of controller expense dashboard setting.
