'use strict';

appServices
    .factory('Activate', function ($resource, ApiInfo) {
        return $resource(ApiInfo.url + 'api/activate', {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });
    });


