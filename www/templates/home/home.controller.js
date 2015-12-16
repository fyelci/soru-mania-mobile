'use strict';

appControllers
    .controller('HomeController', function ($scope) {

        //Google Analytics
        if(typeof analytics !== 'undefined') {
            analytics.trackView('Ana Sayfa');
        }

        console.log('Enter to HomeController.');

    });
