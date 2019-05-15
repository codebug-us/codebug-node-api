// This is where we import the libraries that we'll be using
var express = require('express');
var request = require('request');
var cors = require('cors');
var dotenv = require('dotenv');
var bodyParser = require('body-parser')

// Here we initialize our Express server and configure the library
// we're using for our environment variables
var app = express();
dotenv.config();

// This is a library called Body Parser that helps us parse the requests
// we will receive from your frontend applications
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

// This uses our environment file to set who we accept requests from. 
// We add "null" to our CORS_ORIGINS environment variable to develop locally,
// otherwise we should add the url of our website (ex: https://test-api.surge.sh)
// If there are multiple sites we want to accept requests from, semi-colon separate them in our CODEBUG_CORS_ORIGINS environment variable
var whitelist = process.env.CODEBUG_CORS_ORIGINS.split(";")
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


// Params: 
//      api_key (required) => Name of the environment variable you'd like the value for
app.get("/env", cors(corsOptions), function(req, res) {
	if ("api_key" in req.query) {
		var apiKeyName = req.query["api_key"];
    var apiValue = process.env[apiKeyName];
    if (apiValue) {
      res.status(200).send({[apiKeyName]: apiValue})
    }
    res.status(400).send({error: "Could not find an environment variable matching your API key."})
	} else {
		res.status(400).send({error: "Did not find the api_key parameter in your request."})
	}
});

// Params: 
// 		apiUrl (required) => "https://api.airtable.com/v0/appname/database_name?param1=test&param2=test"
// 		apiMethod (required) => "GET" or "POST"
//    apiHeaders (optional) => javascript object containing headers to send. 
//                             If you set the value of your header's key-value pair to an environment variable,
//                             we will replace your value with the environment variable
app.post("/post", cors(corsOptions), function(req, res) {
  var apiUrl;
  var apiMethod;
  var apiHeaders;
  var apiData;
  var requestData = req.body;

  if ("apiHeaders" in requestData) {
  	apiHeaders = requestData["apiHeaders"];
    var keys = Object.keys(apiHeaders);
    for (var i=0; i<keys.length; i++){
      var val = apiHeaders[keys[i]];
      var envVal = process.env[val];
      if (envVal && envVal.length > 0) {
        apiHeaders[keys[i]] = envVal;
      }
    };
  } else {
	  apiHeaders = {};
  }

  if ("apiData" in requestData) {
  	apiData = requestData["apiData"];
  } else {
	  apiData = {};
  }

  if ("apiUrl" in requestData && "apiMethod" in requestData) {
  	apiUrl = requestData["apiUrl"];
  	apiMethod = requestData["apiMethod"];
  	if (apiUrl && apiUrl.length > 0) {
      var listOfEnvironmentVariables = Object.keys(process.env);
      for (var i=0; i<listOfEnvironmentVariables.length; i++) {
        var envVariableKey = listOfEnvironmentVariables[i];
        if (envVariableKey.indexOf("CODEBUG_") > -1 && apiUrl.indexOf(envVariableKey) > -1){
          var envVariableValue = process.env[listOfEnvironmentVariables[i]];
          apiUrl = apiUrl.replace(envVariableKey, envVariableValue);
        }
      }
  	}

    console.log(apiUrl);
  	if (apiMethod.toUpperCase() === "GET") {
  		request(apiUrl, {headers: apiHeaders}, function (error, response, body) {	
  			res.send(response);
  		});
  	} else if (apiMethod.toUpperCase() === "POST") {
  		request({
    			url: apiUrl, 
    			headers: apiHeaders, 
    			method: "POST",
    			body: JSON.stringify(apiData)
  		}, function (error, response, body) {
  			res.send(response);
  		});
  	} else {
  		res.status(400).send({ 
  			error: "Currently our API can only use GET and POST. You may need to build the other API method functionality yourself." 
  		});
  	}

  } else { //no apiUrl + apiMethod
  	res.status(400).send({ 
  		error: "Invalid request. Must have apiUrl and apiMethod!" 
  	});
  }

});


// This starts our server
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

