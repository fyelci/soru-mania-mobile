// Controller of expense dashboard page.
appControllers.controller('profileDashboardCtrl', function ($scope,$state,$stateParams, $mdToast, User, Principal, ApiInfo, AskedQuestionsService, WatchedQuestionsService, AnsweredQuestionsService, FollowingUserService, FollowerUserService) {

    //Google Analytics
    if(typeof analytics !== 'undefined') {
        analytics.trackView('Profil');
    }

    Principal.identity().then(function(account) {
        $scope.account = account;
    });

    $scope.isOwnProfile = false;
    $scope.isAnimated =  true;

    //Ekranda hangi panellerin görünür olduğunu bu parametreler ayarlar
    $scope.questionListVisible =  false;
    $scope.userListVisible =  false;
    $scope.basicInfoVisible =  true;

    $scope.questions = [];
    $scope.userList = [];
    $scope.page = 1;
    $scope.hasMoreData = true;
    var serviceLocked = false;
    //Sayfa açılır açılmaz infinite scroll servisi çalışmaması için
    var startQueryServices = false;
    var prevListType = undefined;

    $scope.initForm = function () {
        if($stateParams.message) {
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1000,
                position: 'top',
                locals: {
                    displayOption: {
                        title: $stateParams.message
                    }
                }
            });
        }

        if($stateParams.username === $scope.account.login) {
            $scope.isOwnProfile = true;
        }

        User.get({login: $stateParams.username}, function(result) {
            $scope.user = result;
        });
    }

    $scope.$on('$ionicView.enter', function() {
        console.log('Im in enter of profile');
    });

    $scope.goToSetting = function () {
        $state.go("app.profileSetting");
    };


    $scope.getBasicInfo = function() {
        $scope.questionListVisible =  false;
        $scope.userListVisible =  false;
        $scope.basicInfoVisible =  true;

        startQueryServices = false;

        $scope.questions = [];
        $scope.userList = [];
        $scope.page = 1;
        $scope.hasMoreData = true;
    }

    $scope.getUsers = function(listType) {
        startQueryServices = true;
        serviceLocked = true;

        $scope.questionListVisible =  false;
        $scope.userListVisible =  true;
        $scope.basicInfoVisible =  false;

        var servicePrototype = undefined;
        if(listType === 4) {
            servicePrototype = FollowingUserService;
        } else if (listType === 5) {
            servicePrototype = FollowerUserService;
        } else {
            console.log('No List Type Found for User');
            return;
        }

        if(prevListType != listType) {
            $scope.userList = [];
            $scope.page = 1;
            $scope.hasMoreData = true;
        }

        var listParam =
        {   userId: $scope.user.id,
            page: $scope.page - 1,
            size: ApiInfo.pageSize
        };

        servicePrototype.query(listParam, function(result, headers) {
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

        if(listType) {
            prevListType = listType;
        }
    }

    //Sorulari yukleme fonksiyonu
    $scope.getQuestions = function(listType) {
        startQueryServices = true;
        serviceLocked = true;

        $scope.questionListVisible =  true;
        $scope.userListVisible =  false;
        $scope.basicInfoVisible =  false;

        var servicePrototype = undefined;
        if(listType === 1) {
            servicePrototype = AskedQuestionsService;
        } else if (listType === 2) {
            servicePrototype = AnsweredQuestionsService;
        } else if(listType === 3) {
            servicePrototype = WatchedQuestionsService;
        } else {
            console.log('No List Type Found for Question');
            return;
        }

        if(prevListType != listType) {
            $scope.questions = [];
            $scope.page = 1;
            $scope.hasMoreData = true;
        }

        var listParam =
        {   userId: $scope.user.id,
            page: $scope.page - 1,
            size: ApiInfo.pageSize,
            sort: ['createDate' + ',' + 'desc', 'id']
        };

        servicePrototype.query(listParam, function(result, headers) {
            if(result.length < ApiInfo.pageSize) {
                $scope.hasMoreData = false;
            }
            if($scope.page > 1) {
                $scope.questions = $scope.questions.concat(result);
                console.log('In Infinite scroll. Size is: ' + $scope.questions.length);
            } else {
                $scope.questions = result;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
            serviceLocked = false;
        });

        if(listType) {
           prevListType = listType;
        }
    };

    //Asagi dogru sonsuz scroll yapilirken calisir.
    $scope.infiniteLoad = function() {
        if(!serviceLocked && startQueryServices) {
            $scope.page = $scope.page + 1;
            console.log('Loading page for: ' + $scope.page);
            if (prevListType === 4 || prevListType === 5) {
                $scope.getUsers(prevListType);
            } else {
                $scope.getQuestions(prevListType);
            }
        }
    };

    $scope.goToQuestion = function (id) {
        $state.go("app.question", {id: id});
    };

    $scope.initForm();

});// End of controller expense dashboard.

// Controller of expense dashboard setting.
appControllers.controller('profileDashboardSettingCtrl', function ($rootScope, $scope, $state,$ionicHistory,$ionicViewSwitcher, Auth) {

    $scope.logout = function () {
        Auth.logout();
        $rootScope.$broadcast('userLogoutSuccess');
        $state.go('app.home');
    };
}); // End of controller expense dashboard setting.
