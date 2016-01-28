'use strict';

appServices
    .factory('Question', function ($resource, DateUtils, ApiInfo) {
        return $resource(ApiInfo.url + 'api/questions/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.createDate = DateUtils.convertDateTimeFromServer(data.createDate);
                    data.lastModifiedDate = DateUtils.convertDateTimeFromServer(data.lastModifiedDate);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    })
    .factory('AskedQuestionsService', function ($resource, ApiInfo) {
        return $resource(ApiInfo.url + 'api/questions/asked/:userId', {}, {
            'query': { method: 'GET', isArray: true}
        });
    })
    .factory('AnsweredQuestionsService', function ($resource, ApiInfo) {
        return $resource(ApiInfo.url + 'api/questions/answered/:userId', {}, {
            'query': { method: 'GET', isArray: true}
        });
    })
    .factory('WatchedQuestionsService', function ($resource, ApiInfo) {
        return $resource(ApiInfo.url + 'api/questions/watched/:userId', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
