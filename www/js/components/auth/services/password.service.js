'use strict';

appServices
    .factory('Password', function ($resource, ApiInfo) {
        return $resource(ApiInfo.url + 'api/account/change_password', {}, {
        });
    });

appServices
    .factory('PasswordResetInit', function ($resource, ApiInfo) {
        return $resource(ApiInfo.url + 'api/account/reset_password/init', {}, {
        })
    });

appServices
    .factory('PasswordResetFinish', function ($resource, ApiInfo) {
        return $resource(ApiInfo.url + 'api/account/reset_password/finish', {}, {
        })
    });
