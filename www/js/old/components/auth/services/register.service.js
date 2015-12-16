'use strict';

appServices
    .factory('Register', function ($resource, ApiInfo) {
        return $resource(ApiInfo.url + '/register', {}, {
        });
    });


