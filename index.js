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
var dataPath = __dirname+"/data/"
var upload = require('./diarization_pipeline/Upload.js');
var diarize = require('./diarization_pipeline/Diarize.js');
var db = require('./data_management/DBManager.js');
var wavFileInfo = require('wav-file-info');
var cleanup = require('./data_management/CleanUp.js');
var fs = require('fs');

// render views in html
app.engine('html', require('ejs').renderFile);

// anything at /static, reference the public directory
app.use('/static',express.static('public'))

// for /upload, run the uploadSequence function
router.use('/upload', uploadSequence);

// for /upload_multiple, run the multiUploadSequence function
router.use('/upload_multiple', uploadMultipleSequence);

// given results, find the JSON file corresponding to the tag
// then display that file
router.use('/results/:jsonDataName', showResults);

// given results, find the JSON file corresponding to the tag
// then display that file
router.use('/multiple_results', showMultiResults);

// given the root, show the index
router.get("/",function(req,res){
  res.sendFile(viewPath+'index.html')
});

// given the multi, show the multi-upload page
router.get("/multiple",function(req,res){
  res.sendFile(viewPath+'multi.html')
});

// use the router specified
app.use("/", router);

app.get('*', function(req, res) {
  // handle miscellaneous requests
  //console.log("caught "+req.url);
});

// run server on port 8080
app.listen(8080,function(){
  console.log("LIVE ON 8080");
});

// upload the specified file
function uploadSequence(req,res,next){

  // run the upload promise
  upload.single(req, res)

  // run the diarization sequence
  .then(diarize)

  // move the data into the db
  .then(db.insert)

  // given the json fileoutput
  .then(function(file){

    cleanup.run(file.tag, file.ext);

    // redirect to the desired results page
    res.redirect('/results/'+file.tag);

    next();
  })

  // note any error
  .catch(function(err){
    console.log(err);
    next();
  });
}

// upload the specified files
function uploadMultipleSequence(req,res,next){

  // run the upload promise
  upload.multi(req, res)

  // run the diarization sequence
  .then(diarize.multi)

  // given the json fileoutput
  .then(function(jsonFileName){

    // redirect to the desired results page
    res.redirect('/multiple_results');

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

  // get the record of the given file
  db.get(fileName)

  // render the results
  .then(function(jsonData){

    res.render(viewPath + 'results.html', {
      data : JSON.stringify(jsonData),
      wavUrl : JSON.stringify(jsonData.wav)
    });

    next();
  });

}
