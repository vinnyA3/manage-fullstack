angular.module('authService', [])
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
//auth factory to login and get information
//inject $http for communicating with API
//inject $q to return promise objects
//inject Auth Token to manage tokens
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
    .factory('Auth', function($http,$q,AuthToken){
        //create auth factory object
        var authFactory = {};
    
        //handle login
    
        //handle logout
    
        //check if the user is logged in
    
        //get the user information
        
        //return the auth factory
    
        return authFactory;
    })
//Factory for handling the tokens ++++++++++++++++++++++++++
//Inject $window to store token on the client side
    .factory('AuthToken', function($window){
        //create auth token factory
        var authTokenFactory = {};
    
        //get the token
 authTokenFactory.getToken = function(){
   return $window.localStorage.getItem('token');  
 }; 
    
        //set the token or clear the token
        //if a token is passed, set the token
        //if there is no token, clear it from the local storage
 authTokenFactory.setToken = function(token){
   if(token){
       $window.localStorage.setItem('token',token);
   } 
    else{
        $window.localStorage.removeItem('token');
    }
 };
    return authTokenFactory;
})
// application configuration to integerate token into requests++++++++++++++++++++++++++==
.factory('AuthInterceptor', function($q, AuthToken){
   var interceptorFactory = {};
    
    //attach the token to every request
    
    //redirect if a token does not authenticate
    
    return interceptorFactory;
});