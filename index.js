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
var upload = require('./data_management/Upload.js');
var diarize = require('./diarization_pipeline/Diarize.js');
var db = require('./data_management/DBManager.js');
var cleanup = require('./data_management/CleanUp.js');
var fs = require('fs');

app.set('port', (process.env.PORT || 5000))

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
router.use('/results/:jsonDataName', showSingleResults);

// given results, find the JSON file corresponding to the tag
// then display that file
router.use('/multiple_results/:jsonDataName', showMultiResults);

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
app.listen( app.get('port'),function(){
  console.log("App is running on port "+app.get('port'));
});

// upload the specified file
function uploadSequence(req,res,next){

  // run the upload promise
  upload.single(req, res)

  /// redirect to avoid hanging
  .then(waitRedirect.bind(null,res,'/results/',next))

  // run the diarization sequence
  .then(diarize.single)

  // move the data into the db
  .then(db.insert)

  // given the json fileoutput
  .then(function(file){

    cleanup.run(file.tag, file.ext);

  })

  // note any error
  .catch(function(err){
    console.log(err);
  });
}

// upload the specified files
function uploadMultipleSequence(req,res,next){

  // run the upload promise
  upload.multi(req, res)

  // redirect to avoid hanging
  .then(waitRedirect.bind(null,res,'/multiple_results/',next))

  // run the diarization sequence
  .then(diarize.multi)

  // move the data into the db
  .then(db.insert)

  // given the json fileoutput
  .then(function(file){

    cleanup.run(file.tag, file.ext, file.files);

  })

  // note any error
  .catch(function(err){
    console.log(err);
  });
}

// redirect to the results page
function waitRedirect(res,page,next,input){

  return new Promise(function(resolve,reject){

    // redirect to the desired results page
    res.redirect(page+input.name);

    // pass the input down the promise chain
    resolve(input);

    //
    next();
  });
}

// show results page, given a tag to refer to a json data file
function showSingleResults(req,res,next){

  // show the results for a single diarization
  showResults(req,res,next,false);

}

// show results page, given a tag to refer to a json data file
function showMultiResults(req,res,next){

  // show the results for a multi diarization
  showResults(req,res,next,true);

}

function showResults(req,res,next,multi){

  // send the multi view if multi
  var view = "results.html";
  if(multi){
    view = "multiple_results.html";
  }

  // get the filename from the URL
  var fileName = req.params.jsonDataName;

  // get the record of the given file
  db.get(fileName)

  // render the results
  .then(function(jsonData){

    // if we got a result, go to the results page!
    if(jsonData){

      console.log('sending results');

      res.render(viewPath + view, {
        data : JSON.stringify(jsonData),
        wavUrl : jsonData.wav
      });
    }

    // otherwise, tell the user to chill
    else {
      console.log('sending waiting page');
      res.render(viewPath+'waiting.html');
    }

    next();

  }).catch(function(err){

    console.log(err);
    next();
  });


}
