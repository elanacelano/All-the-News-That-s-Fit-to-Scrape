// Dependencies
var mongo = require("mongodb");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.msnbc.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every article tag, and do the following:
    $("p.title").each(function(i, element) {

      // Save an empty result object
      var results =  [];

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // create a new entry
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  Article.find({}, function(err, doc) {
    if (err) {
      console.log("Error finding all articles.");
    } else {
      res.json(doc);
    }
  });
});

// This will grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {

  Article
  .findOne({
    _id: req.params.id
  })
  .populate("note")
  .exec(function (err, doc) {
    if (err) {
      console.log("Error finding article " + req.params.id);
    } else {
      res.json(doc);
    }
  });
});

// Create a new note 
app.post("/articles/:id", function(req, res) {

  var newNote = new Note(req.body);
  newNote.save(function (err, doc){
    if (err) {
      console.log("Error saving note to the database.");
    } else {
      Article
      .findOneAndUpdate({
        _id: req.params.id
      }, {
        note: doc._id
      })
      .exec(function (err, doc) {
        if (err) {
          console.log("Error updating article.")
        } else {
          res.send(doc);
        }
      });
    }
  });
});

app.post("/unread", function(req, res) {
 if (err) {
      console.log("Error saving note to the database.");
    } else {
      Article
      .findOneAndUpdate({
        _id: req.params.id
      }, {
        note: doc._id
      })
      .exec(function (err, doc) {
        if (err) {
          console.log("Error updating article.")
        } else {
          res.send(doc);
        }
      });
    }
  });
};

  results.push({
    title: title,
    link, link
  });
});  


//rec.body()

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});