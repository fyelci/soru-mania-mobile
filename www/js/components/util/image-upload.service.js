'use strict';

appServices
    .factory('ImageUploadService', function ($q, $ionicLoading, $cordovaFileTransfer, CLOUDINARY_CONFIGS) {
        var service = {};
        service.uploadImage = uploadImage;
        return service;
        function uploadImage(imageURI, uploadOptions) {
            var deferred = $q.defer();
            var fileSize;
            var percentage;
            // Find out how big the original file is
            window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
                fileEntry.file(function(fileObj) {
                    fileSize = fileObj.size;
                    // Display a loading indicator reporting the start of the upload
                    $ionicLoading.show({template : 'Resim Yükleniyor : ' + 0 + '%'});
                    // Trigger the upload
                    uploadFile();
                });
            });
            function uploadFile() {
                // Add the Cloudinary "upload preset" name to the headers

                uploadOptions.params.upload_preset = CLOUDINARY_CONFIGS.UPLOAD_PRESET;
                $cordovaFileTransfer
                    // Your Cloudinary URL will go here
                    .upload(CLOUDINARY_CONFIGS.API_URL, imageURI, uploadOptions)

                    .then(function(result) {
                        // Let the user know the upload is completed
                        $ionicLoading.show({template : 'Resim Yüklendi', duration: 1000});
                        // Result has a "response" property that is escaped
                        // FYI: The result will also have URLs for any new images generated with
                        // eager transformations
                        var response = JSON.parse(decodeURIComponent(result.response));
                        deferred.resolve(response);
                    }, function(err) {
                        // Uh oh!
                        console.log('Error on upluad image: ');
                        console.log(err);
                        $ionicLoading.show({template : 'Resim Yükleme Başarısız Oldu', duration: 2000});
                        deferred.reject(err);
                    }, function (progress) {
                        // The upload plugin gives you information about how much data has been transferred
                        // on some interval.  Use this with the original file size to show a progress indicator.
                        percentage = Math.floor(progress.loaded / fileSize * 100);
                        if(percentage > 100) {
                            percentage = 100;
                        }
                        $ionicLoading.show({template : 'Soru Yükleniyor : ' + percentage + '%'});
                    });
            }
            return deferred.promise;
        }
    });