//This is Controller for Dialog box.
appControllers.constant('ApiInfo', {
    pageSize : 5,
    //url: "/"     //Development
    //url: "http://10.0.2.2:8080/"    //Android
    //url: "http://localhost:8080/"   //Ios
    url: "http://10.10.1.17:8080/"   //Emulator
    //url: "http://192.168.2.73:8080/"   //Emulator
    //url: "http://127.0.0.1:8080/"   //Production
}).constant('CLOUDINARY_CONFIGS', {
    UPLOAD_PRESET : 'ljoxbn90',
    API_URL: 'https://api.cloudinary.com/v1_1/sorumania/image/upload'
});