/*
  This is the primary driver for the the overall app
  It handles:
    rerouting
    driver management
    view rendering
*/

var express = require('express');
var app = express();
var router = express.Router();
var viewPath = __dirname+"/views/";
var dataPath = __dirname+"/data/json/"
var upload = require('./diarization_pipeline/Upload.js').run;
var diarize = require('./diarization_pipeline/Diarize.js').run;
var fs = require('fs');

// render views in html
app.engine('html', require('ejs').renderFile);

// anything at /static, reference the public directory
app.use('/static',express.static('public'))

// for /upload, run the uploadSequence function
router.use('/upload', uploadSequence);

// given results, find the JSON file corresponding to the tag
// then display that file
router.use('/results/:jsonDataName', showResults)

// given the root, show the index
router.get("/",function(req,res){
  res.sendFile(viewPath+'index.html')
});

// use the router specified
app.use("/", router);

app.get('*', function(req, res) {
  // handle miscellaneous requests
});

// run server on port 8080
app.listen(8080,function(){
  console.log("LIVE ON 8080");
});

// upload the specified file
function uploadSequence(req,res,next){

  // run the upload promise
  upload(req, res)

  // run the diarization sequence
  .then(diarize)

  // given the json fileoutput
  .then(function(jsonFileName){

    // redirect to the desired results page
    res.redirect('/results/'+jsonFileName);

    next();
  })

  // note any error
  .catch(function(err){
    console.log(err);
    next();
  });
}

// show results page, given a tag to refer to a json data file
function showResults(req,res,next){

  // get the filename from the URL
  var fileName = req.params.jsonDataName;

  // read the data from the file
  var data = fs.readFileSync(dataPath+fileName+'.json', 'utf8');

  // render the results page, supplying it with the necessary data
  res.render(viewPath+'results.html',{data: data});

  next();
}
