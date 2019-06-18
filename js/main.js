var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("../config/passport");
var db = require("../models");
var PORT = 3001;
var movieData;

app.use(bodyParser.urlencoded({ extended: false })); //For body parser
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("../routes/html-routes.js")(app);
require("../routes/api-routes.js")(app);

app.get('/', (req, res)=>
{
	console.log("from the get /");
    res.render("members.html");
});


app.get("/movieInfo", function(req, res)
{
    var query = req.query.wantedMovie;
    var url = "http://www.omdbapi.com/?s=";
    var key = "&apikey=thewdb";
    request(url + query + key, function(error, response, body)
    {
        if(!error && response.statusCode == 200)
        {
            var movieData = JSON.parse(body);
            // response.render("movieInfo", {movieData: movieData});
            // res.send(movieData["Title"]);
            res.render("movieInfo", {movieData: movieData});
            // console.log(movieData);
        }
    });
});

app.get("/wantedMovie", (req,res)=>
{
    res.render('../ejs/wantedMovie', {req: req});
    // console.log(poster);

    // var query = req.query.wantedMovie;
    // var url = "http://www.omdbapi.com/?s=";
    // var key = "&apikey=thewdb";
    // request(url + query + key, function(error, response, body)
    // {
    //     if(!error && response.statusCode == 200)
    //     {
    //         var movieData = JSON.parse(body);
    //         // response.render("movieInfo", {movieData: movieData});
    //         // res.send(movieData["Title"]);
    //         res.render("../ejs/wantedMovie", {movieData: movieData});
    //         // console.log(movieData);
    //     }
    // });

    

})


//this will listen to and show all activities on our terminal to 
//let us know what is happening in our app
// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
  });