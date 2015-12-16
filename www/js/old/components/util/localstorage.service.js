'use strict';

// LocalStorage service have ability to store data by HTML5 localStorage feature.
//
// The data will store in a json format.
// object schema of note data is:
// [{
//     id: id of note,
//     title: title of note,
//     detail: note detail,
//     createDate: note created date
// }]
appServices.factory('localStorage', function ($filter, $window) {
  return {
    // Get data from localStorage it will use data key for getting the data.
    // Parameter :
    // key = reference of object in localStorage.
    get: function (key) {
      return JSON.parse($window.localStorage[key] || "null");
    },

    // Add data to localStorage it will use data key
    // by input data key and value for setting data to localStorage.
    // Parameter :
    // key = reference of object in localStorage.
    // value = data that will store in localStorage.
    set: function (key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },

    //Remove all data from localStorage.
    removeAll: function () {
      $window.localStorage.clear();
    }

  };
});//End LocalStorage service.