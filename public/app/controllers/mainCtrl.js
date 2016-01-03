angular.module('mainCtrl',[])
    .controller('mainController', function($rootScope, $location, Auth){
        var vm = this;
        
        //get info if a person is logged in
        vm.loggedIn = Auth.isLoggedIn();
    
        //check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function(){
            vm.loggedIn = Auth.isLoggedIn();
            
            //get user information on route change
            Auth.getUser()
                .success(function(data) {
                    vm.user = data;
                });
            
        });
        //function to handle the login form
        vm.doLogin = function(){
          vm.processing = true;
            
          //clear the login
            
          vm.error = '';
          Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function(data){
              vm.processing = false;
              
              //if a user successfully logs in, redirect to the users page
              if(data.success){
                  $location.path('/users');
              }else{
                  vm.error = data.message;
              }
              
            });
        };
    
        //function to handle logout login form
        vm.doLogout = function(){
            Auth.logout();
            //reset all user info
            vm.user = {};
            $location.path('/login');
        };
    
    });//end controller