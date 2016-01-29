// Controller of menu toggle.
// Learn more about Sidenav directive of angular material
// https://material.angularjs.org/latest/#/demo/material.components.sidenav
appControllers.controller('menuCtrl', function ($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, Principal) {
    
    $scope.toggleLeft = buildToggler('left');

    Principal.identity().then(function(account) {
        $scope.account = account;
    });

    $scope.$on('userAuthSuccess', function() {
        $scope.refreshUser();
    });

    $scope.$on('userAccountUpdateSuccess', function() {
        $scope.refreshUser();
    });

    $scope.refreshUser = function () {
        Principal.identity().then(function(account) {
            $scope.account = account;
        });
    }

    $scope.$on('userLogoutSuccess', function() {
        $scope.account = {};
    });

    // buildToggler is for create menu toggle.
    // Parameter :  
    // navID = id of navigation bar.
    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID).toggle();
        }, 0);
        return debounceFn;
    };// End buildToggler.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination state. 
    // Parameter :  
    // stateNames = target state to go
    $scope.navigateTo = function (stateName, username) {
        $timeout(function () {
            $mdSidenav('left').close();
            if ($ionicHistory.currentStateName() != stateName || stateName == 'app.profile') {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                if(!username) {
                    $state.go(stateName);
                } else {
                    console.log('Im in go to current profile');
                    $state.go(stateName, {username: username});
                }
            }
        }, ($scope.isAndroid == false ? 300 : 0));
    };// End navigateTo.
}); // End of menu toggle controller.