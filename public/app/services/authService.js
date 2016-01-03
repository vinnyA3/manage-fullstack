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
        authFactory.login = function(username,password){
          //return the promise object and its data
          return $http.post('/api/authenticate', {
              username: username,
              password: password
          })
          .success(function(data){
             AuthToken.setToken(data.token);
              return data;
          });
        };
        //handle logout
        authFactory.logout = function(){
            //clear the token
            AuthToken.setToken();
        };
        //check if the user is logged in
        //check if there is a local token
        authFactory.isLoggedIn = function(){
            if(AuthToken.getToken()){
                return true;
            }
            else{
                return false;
            }
        };
        //get the user information
        authFactory.getUser = function(){
            if(AuthToken.getToken()){
                return $http.get('/api/me', {cache:true});
            }
            else{
                return $q.reject({message: 'User has no token!'});
            }
        };
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
    
        //function to set the token or clear the token
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
// application configuration to integerate token into requests ++++++++++++++++++++++++++==
.factory('AuthInterceptor', function($q, $location, AuthToken){
    
   var interceptorFactory = {};
    //this will happen on all HTTP requests
    interceptorFactory.request = function(config){
        
      //grab the token
      var token = AuthToken.getToken();
    
      //if the token exists, add it to the header as x-access-token
      if(token){
          config.headers['x-access-token'] = token;
      }
      return config;
    };
    
    //this happens on response errors 
    interceptorFactory.responseError = function(response){
      //if the server returns a 403 forbidden response
      if(response.status == 403){
          AuthToken.setToken();
          $location.path('/login');
      }
    
      //return the errors from the server as a promise
        return $q.reject(response);
    };
    
    return interceptorFactory;
});