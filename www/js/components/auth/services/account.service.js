'use strict';

appServices
    .factory('Account', function Account($resource, ApiInfo) {
        return $resource(ApiInfo.url + 'api/account', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });
    });
