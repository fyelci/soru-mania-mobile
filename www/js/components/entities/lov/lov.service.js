'use strict';

appServices
    .factory('Lov', function ($resource, DateUtils) {
        return $resource('api/lovs/:id', {}, {
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
    .factory('LovType', function ($resource, DateUtils) {
        return $resource('api/lovs/type/:type', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                isArray: true
            }
        });
    });
