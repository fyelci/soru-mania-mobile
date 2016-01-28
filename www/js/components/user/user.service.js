'use strict';

appServices
    .factory('User', function ($resource) {
        return $resource('api/users/:login', {}, {
                'query': {method: 'GET', isArray: true},
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'save': { method:'POST' },
                'update': { method:'PUT' },
                'delete':{ method:'DELETE'}
            });
        })
    .factory('FollowingUserService', function ($resource) {
        return $resource('api/users/following/:userId', {}, {
            'query': {method: 'GET', isArray: true}
        });
    })
    .factory('FollowerUserService', function ($resource) {
        return $resource('api/users/follower/:userId', {}, {
            'query': {method: 'GET', isArray: true}
        });
    });
