// Dependencies
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");

// Require models
var Articles = require("../models/articles");
var Comments = require("../models/comments");

var router = express.Router();

// Grabs an article by it's ObjectId
router.get("/articles/:id", function (req, res) {
    console.log("get comments")
    // queries the db to find the article with a matching id 
    Articles.findOne({ "_id": req.params.id })
        // populates all of the comments associated with it
        .populate("comments")
        // executes the query
        .exec(function (error, doc) {
            // logs any errors
            if (error) {
                console.log(error);
            } else {
                // sends doc to the browser as a json object
                res.json(doc);
            }
        });
});

// Creates a new note or replaces an existing note
router.post("/articles/:id", function (req, res) {
    console.log("save comments")
    // Creates a new note and passes the req.body to the entry
    var newComment = new Comments(req.body);
    // Saves the new note the db
    newComment.save(function (error, doc) {
        // Log errors if any
        if (error) {
            console.log(error);
        } else {
            // Uses the article id to find and update it's note
            Articles.findOneAndUpdate({ "_id": req.params.id }, { "comments": doc._id })
                .populate("comments")
                // Executes the above query
                .exec(function (err, doc) {
                    // Log errors if any
                    if (err) {
                        console.log(err);
                    } else {
                        // Or sends the document to the browser
                        res.send(doc);
                    }
                });
        }
    });
});

// Scrapes and displays news articles 
router.get("/", function (req, res) {
    // gets html body
    request("http://www.npr.org/sections/news/", function (error, response, html) {
        // Loads html into cheerio and saves it to $
        var $ = cheerio.load(html);
        // Holds entry objects
        var entry = [];
        // Grabs requested items from sections with classes .item.has-image
        $(".item.has-image").each(function (i, element) {
            // Empties result object
            var result = {};
            // Places selected element properties into result object
            result.title = $(this).children(".item-info").find("h2.title").text();
            result.source = $(this).children(".item-info").find("h3.slug").find("a").text();
            result.teaser = $(this).children(".item-info").find("p.teaser").text();
            result.img = $(this).children(".item-image").find("a").find("img").attr("src");
            result.link = $(this).children(".item-info").find("h2.title").find("a").attr("href");
            // creates an entry object of the Articles model  
            entry.push(new Articles(result));
        });
        for (var i = 0; i < entry.length; i++) {
            entry[i].save(function (err, data) {
                // Log errors if any
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
            // Retrieves articles from db only after all entries have been made
            if (i === (entry.length - 1)) {
                res.redirect("/articles");
            }
        }
    });
});

// Gets unsaved, unhidden articles from db and displays them
router.get("/articles", function (req, res) {
    Articles.find({ "status": 0 }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { articles: data, current: true });
        }
    });
});

// Gets saved articles from db and displays them
router.get("/saved", function (req, res) {
    Articles.find({ "status": 1 }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { articles: data, saved: true });
        }
    });
});

// Gets hidden articles from db and displays them
router.get("/hidden", function (req, res) {
    Articles.find({ "status": 2 }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { articles: data, hidden: true });
        }
    });
});

// Assigns saved status to article 
router.post("/save", function (req, res) {
    Articles.findOneAndUpdate({ "_id": req.body.articleId }, { $set: { "status": 1 } })
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send("Post successful");
            }
        });
});

// Assigns hidden status to article
router.post("/hide", function (req, res) {
    Articles.findOneAndUpdate({ "_id": req.body.articleId }, { $set: { "status": 2 } })
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send("Post successful");
            }
        });
});

// Removes articles from saved status 
router.post("/unsave", function (req, res) {
    Articles.findOneAndUpdate({ "_id": req.body.articleId }, { $set: { "status": 0 } })
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send("Post successful");
            }
        });
});

// Removes articles from hidden status 
router.post("/unhide", function (req, res) {
    Articles.findOneAndUpdate({ "_id": req.body.articleId }, { $set: { "status": 0 } })
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send("Post successful");
            }
        });
});

module.exports = router;
