'use strict';

appControllers
    .controller('HomeController', function ($scope, $state, $stateParams, $mdToast, $ionicPopover, Question, ApiInfo) {
        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Ana Sayfa');
        }

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });

        if($stateParams.message) {
            // Showing toast for error.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 2000,
                position: 'top',
                locals: {
                    displayOption: {
                        title: $stateParams.message
                    }
                }
            });//End showing toast.
        }

        $scope.questions = [];
        $scope.page = 1;
        $scope.hasMoreData = true;
        var serviceLocked = false;
        $scope.selectedCategory = undefined;
        $scope.selectedLesson = undefined;
        $scope.selectedListType = undefined;

        $scope.$on('$ionicView.enter', function() {
        });

        //Sorulari yukleme fonksiyonu
        $scope.loadAll = function(refreshing) {
            serviceLocked = true;
            var listParam =
                {   page: $scope.page - 1,
                    size: ApiInfo.pageSize,
                    sort: ['createDate' + ',' + 'desc', 'id'],
                    categoryId : $scope.selectedCategory,
                    lessonId : $scope.selectedLesson,
                    listType : $scope.selectedListType
                };
            Question.query(listParam, function(result, headers) {
                if(result.length < ApiInfo.pageSize) {
                    $scope.hasMoreData = false;
                }
                if($scope.page > 1) {
                    $scope.questions = $scope.questions.concat(result);
                    console.log('In Infinite scroll. Size is: ' + $scope.questions.length);
                } else {
                    $scope.questions = result;
                }

                if(refreshing) {
                    $scope.hasMoreData = true;
                    $scope.$broadcast('scroll.refreshComplete');
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                serviceLocked = false;
            });
        };

        //Asagi dogru sonsuz scroll yapilirken calisir.
        $scope.infiniteLoad = function() {
            if(!serviceLocked) {
                $scope.page = $scope.page + 1;
                console.log('Loading page for: ' + $scope.page);
                $scope.loadAll();
            }
        };

        //Ekran yukaridan asagi cekildiginde calisir
        $scope.doRefresh = function() {
            if(!serviceLocked) {
                $scope.page = 1;
                console.log('Refreshing: ' + $scope.page);
                $scope.loadAll(true);
            }
        };

        $scope.loadAll();

        $scope.goToQuestion = function (id) {
            $state.go("app.question", {id: id});
        };

        $scope.clear = function () {
        };

        $scope.selectCategory = function (event, categoryId) {
            $scope.selectedCategory = categoryId;

            $scope.questions = [];
            $scope.page = 1;
            $scope.hasMoreData = true;
            serviceLocked = false;

            $(event.target).addClass('active');

            $scope.loadAll();
        };

    });
