'use strict';

appServices
    .factory('AuthServerProvider', function loginService($http, ApiInfo) {
        return {
            login: function(credentials) {
                var data = 'j_username=' + encodeURIComponent(credentials.username) +
                    '&j_password=' + encodeURIComponent(credentials.password) +
                    '&remember-me=' + credentials.rememberMe + '&submit=Login';
                return $http.post(ApiInfo.url + '/authentication', data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (response) {
                    return response;
                });
            },
            logout: function() {
                // logout from the server
                $http.post(ApiInfo.url + '/logout').success(function (response) {
                    // to get a new csrf token call the api
                    $http.get('api/account');
                    return response;
                });
            }
        };
    });
