'use strict';

appServices
    .factory('Lov', function ($resource, DateUtils, ApiInfo) {
        return $resource(ApiInfo.url + 'api/lovs/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    })
    .factory('LovType', function ($resource, DateUtils, ApiInfo) {
        return $resource(ApiInfo.url + 'api/lovs/type/:type', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                isArray: true
            }
        });
    });
