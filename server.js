var express = require("express");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");


var app = express();
var PORT = process.env.PORT || 8080;

var db = require("./models");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static("public"));

require("./routes")(app);


//mongo code
var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});



app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});