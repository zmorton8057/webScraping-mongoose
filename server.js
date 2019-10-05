const express = require('express');
// var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");
// const orm = require('./config/orm')

var axios = require("axios");
var cheerio = require("cheerio");


var app = express();
/////////// For Express API routes to display as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Require all models
var db = require("./models");

// require('dotenv').config()

var PORT = process.env.PORT || 3000;



app.use(express.static('public'));



/////////// For Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// var routes = require("./controllers/controller");
// app.use(routes);

// Use morgan logger for logging requests
app.use(logger("dev"));

///////////////// For Web Scraping
// Connect to the Mongo DB

mongoose.connect(process.env.MONGODB_URI ||"mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes
app.get('/',(req,res)=>{
db.Article.find({},(data)=>{
  console.log(data)
res.render('index',{articles:data})
})
})

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.gamesradar.com//").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $(".listingResult").each(function (i, element) {
        // Save an empty result object
        var result = [];
        
        // Add the text and href of every link, and save them as properties of the result object
        const title = $(element).find(".article-name").text()
        const link =  $(element).find(".article-link").attr('href')
        const author = $(element).find(".by-author").children('span').text().replace(/(\r\n|\n|\r)/gm, "")
        
        // Save these results in an object that we'll push into the results array we defined earlier
        result.push({
          title: title,
          link: link,
          author: author
        });
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // TODO
  
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
      })
  
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
  });

app.listen(PORT, function(){
    console.log("Server Listening on Port: " +  PORT)
})