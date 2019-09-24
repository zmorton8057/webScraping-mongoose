var express = require('express')
var scraper = require('../models/scrape')

var router = express.Router();

router.get("/", function(req,res){
    var hdbrsObj = {
        scrape: data
    }
    console.log(hdbrsObj)
    res.render("index", hdbrsObj)
})


module.exports = router;