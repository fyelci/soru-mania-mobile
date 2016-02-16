appControllers.controller('leaderboardCtrl', function ($scope, $state, ApiInfo, LeaderboardService) {

    //Google Analytics
    if(typeof analytics !== 'undefined') {
        analytics.trackView('Liderlik Tablosu');
    }

    $scope.userList = [];
    $scope.page = 1;
    $scope.hasMoreData = true;
    var serviceLocked = false;

    $scope.listLeaderboard = function() {
        var listParam =
        {   userId: $scope.user.id,
            page: $scope.page - 1,
            size: ApiInfo.pageSize
        };

        LeaderboardService.query(listParam, function(result, headers) {
            if(result.length < ApiInfo.pageSize) {
                $scope.hasMoreData = false;
            }
            if($scope.page > 1) {
                $scope.userList = $scope.userList.concat(result);
                console.log('In Infinite scroll. Size is: ' + $scope.userList.length);
            } else {
                $scope.userList = result;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
            serviceLocked = false;
        });
    }

    $scope.goToUser = function (username) {
        $state.go("app.profile", {username: username});
    };

});
