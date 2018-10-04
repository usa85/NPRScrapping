// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var dotenv = require("dotenv");
// Sets Handlebars
var exphbs = require("express-handlebars");
// Database ORM
var mongoose = require("mongoose");
// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Models needed. Although these variables are not used,
// server.js still needs these variables to access the models
var Articles = require("./models/articles.js");
var Comments = require("./models/comments.js");

// Imports routes
var routes = require("./controllers/articleController.js");

// Loads environment variables from .env file into process.env
dotenv.load();

// Sets mongoose to leverage Promises
mongoose.Promise = Promise;

// Sets port
var port = process.env.PORT || 3000;

// Initializes express
var app = express();

// Logs requests to the console
app.use(logger("dev"));

// Parses data
app.use(bodyParser.urlencoded({
	extended: false
}));

// Makes public a static dir
app.use(express.static(process.cwd() + "/public"));

// Sets default view engine to handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Hooks mongoose with the mongodb database (our db: newsscraper)
var mongoConfig = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";
mongoose.connect(mongoConfig);

// Saves our mongoose connection to db
var db = mongoose.connection;

// Shows any mongoose errors
db.on("error", function (error) {
	console.log("Mongoose Error: ", error);
});

// Logs a success message once logged in to the db through mongoose
db.once("open", function () {
	console.log("Mongoose connection successful.");
});

// Handles routes
app.use("/", routes);

// Listens on port
app.listen(port, function () {
	console.log("Listening on " + port);
});








