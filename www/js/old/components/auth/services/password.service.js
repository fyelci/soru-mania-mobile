'use strict';

appServices
    .factory('Password', function ($resource) {
        return $resource('api/account/change_password', {}, {
        });
    });

appServices
    .factory('PasswordResetInit', function ($resource) {
        return $resource('api/account/reset_password/init', {}, {
        })
    });

appServices
    .factory('PasswordResetFinish', function ($resource) {
        return $resource('api/account/reset_password/finish', {}, {
        })
    });
