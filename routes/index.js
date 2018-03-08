var db = require("../models");

var path = require("path");

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.send('Hello World')
    });


    app.get("/all", function (req, res) {
        // Find all results from the scrapedData collection in the db
        db.scrapedData.find({}, function (error, found) {
            // Throw any errors to the console
            if (error) {
                console.log(error);
            }
            // If there are no errors, send the data to the browser as json
            else {
                res.json(found);
            }
        });
    });

    app.get("/scrape", function (req, res) {
        // Make a request for the news section of ycombinator
        request("https://www.billboard.com/hip-hop-rap-r-and-b", function (error, response, html) {
            // Load the html body from request into cheerio
            var $ = cheerio.load(html);
            // For each element with a "title" class
            $("h3.content-title").each(function (i, element) {
                // Save the text and href of each link enclosed in the current element
                var title = $(element).children("a").text();
                var link = $(element).children("a").attr("href");

                // If this found element had both a title and a link
                if (title && link) {
                    // Insert the data in the scrapedData db
                    db.scrapedData.insert({
                            title: title,
                            link: link
                        },
                        function (err, inserted) {
                            if (err) {
                                // Log the error if one is encountered during the query
                                console.log(err);
                            } else {
                                // Otherwise, log the inserted data
                                console.log(inserted);
                            }
                        });
                }
            });
        });

        // Send a "Scrape Complete" message to the browser
        res.send("Scrape Complete");
    });


};