'use strict';

appServices
    .factory('ScoreHistory', function ($resource, DateUtils, ApiInfo) {
        return $resource(ApiInfo.url + 'api/scoreHistorys/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.createDate = DateUtils.convertDateTimeFromServer(data.createDate);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
