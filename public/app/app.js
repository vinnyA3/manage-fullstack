angular.module('userApp', [
    'ngAnimate',
    'app.routes',
    'authService',
    'mainCtrl',
    'userCtrl',
    'userService'
])
//application configuration in integrate token into requests
.config(function($httpProvider){
   //attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');
});
 