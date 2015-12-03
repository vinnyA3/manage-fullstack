//BASE SETUP
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//call the modules

var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('./config'),
    port = process.env.PORT || 8080, //set the port for our application
    path = require('path'),
    app = express(),
    User = require('./app/models/user');



//APP CONFIGURATION
//use body parser to grab the data from the post requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//configure our app to handle the CORS requests
app.use(function(req,res,next){
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \ Authorization');
    
   next();
});

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database);

//log all the requests to the console
app.use(morgan('dev'));

//SET THE STATIC FILES LOCATION
//USED FOR REQUESTS THAT OUR FRONTEND WILL MAKE
app.use(express.static(__dirname + '/public'))

// API ROUTES ---------------
var apiRouter = require('./app/routes/api')(app,express);
app.use('/api', apiRouter);

//MAIN CATCHALL ROUTE
//SEND USERS TO FRONTEND
//HAS TO BE REGISTERED FOR API ROUTES
app.get('*', function(req,res){
    res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});


//START THE SERVER
app.listen(config.port, function(){
   console.log('Magic happens on port: ' + config.port); 
});

