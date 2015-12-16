//
//Welcome to app.js
//This is main application config of project. You can change a setting of :
//  - Global Variable
//  - Theme setting
//  - Icon setting
//  - Register View
//  - Spinner setting
//  - Custom style
//
//Global variable use for setting color, start page, message, oAuth key.
var db = null; //Use for SQLite database.
window.globalVariable = {
    //custom color style variable
    color: {
        appPrimaryColor: "",
        facebookColor: "#3C5C99"
    },// End custom color style variable
    startPage: {
        url: "/app/home",//Url of start page.
        state: "app.home"//State name of start page.
    },
    message: {
        errorMessage: "Technical error please try again later." //Default error message.
    },
    oAuth: {
        facebook: "551584931664994"//Use for Facebook API appID.
    },
    adMob: "your_api_key" //Use for AdMob API clientID.
};// End Global variable


angular.module('starter', ['ionic','ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services', 'LocalStorageModule', 'ngMaterial', 'ngMessages', 'ngCordova', 'ngResource'])
    .run(function ($ionicPlatform, $cordovaSQLite, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet, $window, Auth, Principal) {


        // Create custom defaultStyle.
        function getDefaultStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important; " +
                "   border-style            : none;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom defaultStyle

        // Create custom style for product view.
        function getProductStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important;" +
                "   border-style            : none;" +
                "   background-image        : url('img/background_cover_pixels.png') !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom style for product view.

        // Create custom style for contract us view.
        function getContractUsStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : transparent !important;" +
                "   border-style            : none;" +
                "   background-image        : none !important;" +
                "   background-position-y   : 4px !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        } // End create custom style for contract us view.

        // Create custom style for Social Network view.
        function getSocialNetworkStyle(socialColor) {
            return "" +
                ".material-background-nav-bar {" +
                "   background              : " + socialColor + " !important;" +
                "   border-style            : none;" +
                "} " +
                "md-ink-bar {" +
                "   color                   : " + socialColor + " !important;" +
                "   background              : " + socialColor + " !important;" +
                "}" +
                "md-tab-item {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle {" +
                "   border-left-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle, md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "    border-top-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-gap {" +
                "   border-top-color        : " + socialColor + " !important;" +
                "   border-bottom-color     : " + socialColor + " !important;" +
                "}" +
                "md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "  border-right-color       : " + socialColor + " !important;" +
                " }" +
                ".spinner-android {" +
                "   stroke                  : " + socialColor + " !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                "a.md-button.md-primary, .md-button.md-primary {" +
                "   color                   : " + socialColor + " !important;" +
                "}";
        }// End create custom style for Social Network view.


        function initialRootScope() {
            $rootScope.appPrimaryColor = appPrimaryColor;// Add value of appPrimaryColor to rootScope for use it to base color.
            $rootScope.isAndroid = ionic.Platform.isAndroid();// Check platform of running device is android or not.
            $rootScope.isIOS = ionic.Platform.isIOS();// Check platform of running device is ios or not.
        };

        function hideActionControl() {
            //For android if user tap hardware back button, Action and Dialog should be hide.
            $mdBottomSheet.cancel();
            $mdDialog.cancel();
        };


        // createCustomStyle will change a style of view while view changing.
        // Parameter :
        // stateName = name of state that going to change for add style of that page.
        function createCustomStyle(stateName) {
            var customStyle =
                ".material-background {" +
                "   background-color          : " + appPrimaryColor + " !important;" +
                "   border-style              : none;" +
                "}" +
                ".spinner-android {" +
                "   stroke                    : " + appPrimaryColor + " !important;" +
                "}";

            switch (stateName) {
                case "app.productList" :
                case "app.productDetail":
                case "app.productCheckout":
                case "app.clothShop" :
                case "app.catalog" :
                    customStyle += getProductStyle();
                    break;
                case "app.facebookLogin" :
                case "app.facebookProfile":
                case "app.facebookFeed" :
                case "app.facebookFriendList":
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.facebookColor);
                    break;
                case "app.contractUs":
                    customStyle += getContractUsStyle();
                    break;
                default:
                    customStyle += getDefaultStyle();
                    break;
            }
            return customStyle;
        }// End createCustomStyle

        // Add custom style while initial application.
        $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);

        $ionicPlatform.ready(function () {
            ionic.Platform.isFullScreen = true;
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            initialRootScope();

            //Checking if view is changing it will go to this function.
            $rootScope.$on('$ionicView.beforeEnter', function () {
                //hide Action Control for android back button.
                hideActionControl();
                // Add custom style ti view.
                $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
            });
        });

        //AUTH START
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (Principal.isIdentityResolved()) {
                Auth.authorize();
            }

        });

        $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            var titleKey = 'SoruMania' ;

            // Remember previous state unless we've been redirected to login or we've just
            // reset the state memory after logout. If we're redirected to login, our
            // previousState is already set in the authExpiredInterceptor. If we're going
            // to login directly, we don't want to be sent to some previous state anyway
            if (toState.name != 'app.login' && $rootScope.previousStateName) {
                $rootScope.previousStateName = fromState.name;
                $rootScope.previousStateParams = fromParams;
            }
        });

        $rootScope.back = function() {
            // If previous state is 'activate' or do not exist go to 'home'
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                $state.go('home');
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };
        //AUTH END

    })

    .config(function ($ionicConfigProvider, $httpProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider, $mdColorPalette, $mdGestureProvider, $mdIconProvider) {

        //Prevent double fire for material buttons...
        $mdGestureProvider.skipClickHijack();


        // Use for change ionic spinner to android pattern.
        $ionicConfigProvider.spinner.icon("android");
        $ionicConfigProvider.views.swipeBackEnabled(false);

        // mdIconProvider is function of Angular Material.
        // It use for reference .SVG file and improve performance loading.
        $mdIconProvider
            .icon('facebook', 'img/icons/facebook.svg')
            .icon('twitter', 'img/icons/twitter.svg')
            .icon('mail', 'img/icons/mail.svg')
            .icon('message', 'img/icons/message.svg')
            .icon('share-arrow', 'img/icons/share-arrow.svg')
            .icon('more', 'img/icons/more_vert.svg');

        //mdThemingProvider use for change theme color of Ionic Material Design Application.
        /* You can select color from Material Color List configuration :
         * red
         * pink
         * purple
         * purple
         * deep-purple
         * indigo
         * blue
         * light-blue
         * cyan
         * teal
         * green
         * light-green
         * lime
         * yellow
         * amber
         * orange
         * deep-orange
         * brown
         * grey
         * blue-grey
         */
        //Learn more about material color patten: https://www.materialpalette.com/
        //Learn more about material theme: https://material.angularjs.org/latest/#/Theming/01_introduction
        $mdThemingProvider
            .theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink');

        appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.

        //$stateProvider is using for add or edit HTML view to navigation bar.
        //
        //Schema :
        //state_name(String)      : Name of state to use in application.
        //page_name(String)       : Name of page to present at localhost url.
        //cache(Bool)             : Cache of view and controller default is true. Change to false if you want page reload when application navigate back to this view.
        //html_file_path(String)  : Path of html file.
        //controller_name(String) : Name of Controller.
        //
        //Learn more about ionNavView at http://ionicframework.com/docs/api/directive/ionNavView/
        //Learn more about  AngularUI Router's at https://github.com/angular-ui/ui-router/wiki
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu/html/menu.html",
                controller: 'menuCtrl',
                resolve: {
                    authorize: ['Auth',
                        function (Auth) {
                            return Auth.authorize();
                        }
                    ]
                }
            })
            .state('app.login', {
                url: "/login",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/user/login/login.html",
                        controller: 'LoginController'
                    }
                }
            })
            .state('app.register', {
                url: "/register",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/user/register/register.html",
                        controller: 'RegisterController'
                    }
                }
            })
            .state('app.dashboard', {
                url: "/dashboard",
                params:{
                    isAnimated:false
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/material-user-interface/dashboard/html/dashboard.html",
                        controller: 'dashboardCtrl'
                    }
                }
            })
            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/home.html"
                    }
                }
            })
            .state('app.profile', {
                url: "/profile",
                params:{
                    isAnimated:true
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/user/profile/html/profile.html",
                        controller: "profileDashboardCtrl"
                    }
                }
            })
            .state('app.profileSetting', {
                url: "/profileSetting",
                views: {
                    'menuContent': {
                        templateUrl: "templates/user/profile/html/profile-setting.html",
                        controller: "profileDashboardSettingCtrl"
                    }
                }
            })
            .state('app.dashboardSetting', {
                url: "/dashboardSetting",
                views: {
                    'menuContent': {
                        templateUrl: "templates/material-user-interface/dashboard/html/dashboard-setting.html",
                        controller: "dashboardSettingCtrl"
                    }
                }
            })
            .state('app.contractlist', {
                url: "/contractlist",
                cache: false,
                params:{
                    isAnimated:true
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/application-storage/sqLite/html/contract-list.html",
                        controller: 'contractListCtrl'
                    }
                }
            })
            .state('app.contractdetail', {
                url: "/contractdetail",
                params: {
                    contractdetail: null,
                    actionDelete: false
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/application-storage/sqLite/html/contract-detail.html",
                        controller: 'contractDetailCtrl'
                    }
                }
            })
            .state('app.contractsetting', {
                url: "/contractsetting",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/application-storage/sqLite/html/contract-setting.html",
                        controller: 'contractSettingCtrl'
                    }
                }
            })
            .state('app.notelist', {
                url: "/notelist",
                params:{
                    isAnimated:false
                },
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/application-storage/local-application-db/html/note-list.html",
                        controller: 'noteListCtrl'
                    }
                }
            })
            .state('app.notedetail', {
                url: "/notedetail",
                params: {
                    noteDetail: null,
                    actionDelete: false
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/application-storage/local-application-db/html/note-detail.html",
                        controller: 'noteDetailCtrl'
                    }
                }
            })
            .state('app.notesetting', {
                url: "/notesetting",
                views: {
                    'menuContent': {
                        templateUrl: "templates/application-storage/local-application-db/html/note-setting.html",
                        controller: 'noteSettingCtrl'
                    }
                }
            })
            .state('app.facebookLogin', {
                url: "/facebookLogin",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/social-network-connect/facebook/html/facebook-login.html",
                        controller: 'facebookLoginCtrl'
                    }
                }
            })
            .state('app.facebookProfile', {
                url: "/facebookProfile",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/social-network-connect/facebook/html/facebook-profile.html",
                        controller: 'facebookProfileCtrl'
                    }
                }
            })
            .state('app.facebookFeed', {
                url: "/facebookFeed",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/social-network-connect/facebook/html/facebook-feed.html",
                        controller: 'facebookFeedCtrl'
                    }
                }
            })
            .state('app.facebookFriendList', {
                url: "/facebookFriendList",
                cache: false,
                params: {
                    access_token: null,
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/social-network-connect/facebook/html/facebook-friend-list.html",
                        controller: 'facebookFriendListCtrl'
                    }
                }
            })
            .state('app.fakeLogin', {
                url: "/fakeLogin",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/authentication/html/fake-login.html"
                    }
                }
            })
            .state('app.fakeSignUp', {
                url: "/fakeSignUp",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/authentication/html/fake-sign-up.html"
                    }
                }
            })
            .state('app.productList', {
                url: "/productList",
                views: {
                    'menuContent': {
                        templateUrl: "templates/share-application-content/social-share/html/product-list.html",
                        controller: 'productListCtrl'
                    }
                }
            })
            .state('app.productDetail', {
                url: "/productDetail",
                params: {
                    product: null,
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/share-application-content/social-share/html/product-detail.html",
                        controller: 'productDetailCtrl'
                    }
                }
            })
            .state('app.productCheckout', {
                url: "/productCheckout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/share-application-content/social-share/html/product-checkout.html",
                        controller: 'productCheckoutCtrl'
                    }
                }
            })
            .state('app.contractUs', {
                url: "/contractUs",
                views: {
                    'menuContent': {
                        templateUrl: "templates/share-application-content/email-message/html/contract-us.html",
                        controller: 'contractUsCtrl'
                    }

                }
            })
            .state('app.deviceInformation', {
                url: "/deviceInformation",
                views: {
                    'menuContent': {
                        templateUrl: "templates/hardware-connect/device-information/html/device-information.html",
                        controller: 'deviceInformationCtrl'
                    }

                }
            })
            .state('app.mobileContractList', {
                url: "/mobileContractList",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/hardware-connect/mobile-contract/html/mobile-contract-list.html",
                        controller: 'mobileContractListCtrl'
                    }

                }
            })
            .state('app.mobileContractDetail', {
                url: "/mobileContractDetail",
                params: {
                    contractDetail: null,
                    actionDelete: false
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/hardware-connect/mobile-contract/html/mobile-contract-detail.html",
                        controller: 'mobileContractDetailCtrl'
                    }

                }
            })
            .state('app.googleAdmob', {
                url: "/googleAdmob",
                views: {
                    'menuContent': {
                        templateUrl: "templates/advertising-application/googleAdmob/html/googleAdmob.html",
                        controller: 'googleAdmobCtrl'
                    }

                }
            })
            .state('app.imagePicker', {
                url: "/imagePicker",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/hardware-connect/image-picker/html/image-picker.html",
                        controller: 'imagePickerCtrl'
                    }

                }
            })
            .state('app.defaultUI', {
                url: "/defaultUI",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/material-user-interface/default-user-interface/html/default-user-interface.html",
                        controller: 'defaultUserInterfaceCtrl'
                    }

                }
            })
            .state('app.tryApp', {
                url: "/tryApp",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/try-app/html/try-app.html"
                    }
                }
            })
            .state('app.tryAppNoBackBtn', {
                url: "/tryAppNoBackBtn",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/try-app/html/try-app-no-back-btn.html"
                    }
                }
            })
            .state('app.pricing', {
                url: "/pricing",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/pricing/html/pricing.html"
                    }
                }
            })
            .state('app.menuDashboard', {
                url: "/menuDashboard",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/menu-dashboard/html/menu-dashboard.html",
                        controller: "menuDashboardCtrl"
                    }
                }
            })
            .state('app.expense', {
                url: "/expense",
                params:{
                    isAnimated:true
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/expense-dashboard/html/expense-dashboard.html",
                        controller: "expenseDashboardCtrl"
                    }
                }
            })
            .state('app.expenseSetting', {
                url: "/expenseSetting",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/expense-dashboard/html/expense-dashboard-setting.html",
                        controller: "expenseDashboardSettingCtrl"
                    }
                }
            })
            .state('app.newsFeed', {
                url: "/newsFeed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/news-feed/html/news-feed.html"
                    }
                }
            })
            .state('app.clothShop', {
                url: "/clothShop",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/cloth-shop/html/cloth-shop.html"
                    }
                }
            })
            .state('app.onlineCourse', {
                url: "/onlineCourse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/online-course/html/online-course.html"
                    }
                }
            })
            .state('app.catalog', {
                url: "/catalog",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/catalog/html/catalog.html",
                        controller: "catalogCtrl"
                    }
                }
            })
            .state('app.locationFeed', {
                url: "/locationFeed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/location-feed/html/location-feed.html"
                    }
                }
            })
            .state('app.cubeFeed', {
                url: "/cubeFeed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/cube-feed/html/cube-feed.html"
                    }
                }
            })
            .state('app.restaurant', {
                url: "/restaurant",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/restaurant/html/restaurant.html"
                    }
                }
            })
            .state('app.singlePushNotification', {
                url: "/singlePushNotification",
                views: {
                    'menuContent': {
                        templateUrl: "templates/push-notification/single-push-notification/html/single-push-notification.html",
                        controller: "singlePushNotificationCtrl"
                    }
                }
            })
            .state('app.schedulePushNotification', {
                url: "/schedulePushNotification",
                views: {
                    'menuContent': {
                        templateUrl: "templates/push-notification/schedule-push-notification/html/schedule-push-notification.html",
                        controller: "schedulePushNotificationCtrl"
                    }
                }
            });
            // End $stateProvider

        //Use $urlRouterProvider.otherwise(Url);
        $urlRouterProvider.otherwise(window.globalVariable.startPage.url);

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
    });