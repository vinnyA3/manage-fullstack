var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

var superSecret = config.secret;

module.exports = function(app,express){
    
    //get the instance of the express Router
var apiRouter = express.Router();

//route for authenticating users
apiRouter.post('/authenticate', function(req,res){
   //find the user
    //select the username and the password explicitly
    User.findOne({
       username : req.body.username 
    }).select('name username password').exec(function(err,user){
        if(err) throw err;
        //if no user with the user name was found
        if(!user){
            return res.json({success: false, message: 'Authentication Failed. User not found.'});
        }else if(user){
            //check if the password matches
            var validPassword = user.comparePassword(req.body.password);
            if(!validPassword){
                return res.json({success:false, message:'Authentication failed.  Incorrect Password.'});
            }else{
                //if the user name is found, and the password is right
                //create a token
                var token = jwt.sign({
                    name: user.name,
                    username: user.username,
                }, superSecret, {
                    expiresInMinutes : 1440 //expires in 24 hours
                });
                
                //return the information including token as JSON
                return res.json({
                    success:true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

//middleware to use for all request and verify tokens
apiRouter.use(function(req,res,next){
//check header or url parameters or post parameter for a token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    //decode the token
    if(token){
        //verifies secret and checks exp
        jwt.verify(token, superSecret, function(err, decoded){
           if(err){
               return res.status(403).send({
                  success: false,
                   message : 'Failed to authenticate token.'
               });
           }else{
               //if everything is good, save to request for use in other routes
               req.decoded = decoded;
               next();
           } 
        });
    }else{
        // if there is no token
        //return an http response of 403 (access forbidden) and an error message
        return res.status(403).send({
           success: false,
            message: 'No Token provided.'
        });
    }
    
    //next() used to be here;
});

//test route to check if everything is working
//accessed at locahost:8080/api
apiRouter.get('/', function(req,res){
    res.json({message: 'hooray!! welcome to our api!'});     
});

//more routes for our api will happen here!
apiRouter.route('/users')
    //create a user
    .post(function(req,res){
        //create a new instance of the user model
        var user = new User();
        
        //set the users information(comes from the request)
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
    
    
        //save the user and check for errors
        user.save(function(err){
                if(err){
                    //duplication entry
                    if(err.code == 11000){return res.json({success: false, message : 'A user with that username already exists. '});}
                    else{return res.send(err);}
                }
                res.json({message: 'User Created!'});
        });
    })
    .get(function(req,res){
        User.find(function(err,users){
           if(err){return res.send(err);}
            //return the users
            return res.json(users);
        });
    });

apiRouter.route('/users/:user_id')
    .get(function(req,res){
        User.findById(req.params.user_id, function(err,user){
           if(err){return res.send(err);}
            //return that user
            return res.json(user);
        });
    })
    .put(function(req,res){
       //use our user model to find the user we want
       User.findById(req.params.user_id, function(err,user){
           if(err){res.send(err);}
           
           //update the users information only if its new
           if(req.body.name){user.name = req.body.name;}
           if(req.body.username){user.username = req.body.username;}
           if(req.body.password){user.password = req.body.password;}
           
           //save the user
           user.save(function(err){
                    if(err){res.send(err);}
                    //return  a message
                     res.json({message: 'User updated!'});
           });
       
        });
    })
    .delete(function(req,res){
        User.remove({
            _id: req.params.user_id
        },function(err){
           if(err) {return res.send(err);}
            
            res.json({message: 'Successfully Deleted!'});
        });
    });
    
    apiRouter.get('/me', function(req,res){
       res.send(req.decoded); 
    });

    
    return apiRouter;

} //end module exports


