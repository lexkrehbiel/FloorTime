/*This moudle performs the upload and redirects to the charts page*/

// node imports
var upload = require('../upload/CompleteUpload.js');
//var spawn = require("child_process").spawn;
var execSync = require('exec-sync')

exports.run = function(req,res,cb){

  // generate the promise version of the upload function
  doUpload = Promise.promisify(upload.run)


  doUpload
  .then(runPipeline)
  .then(convertAudio)
  .then(diarize)
  .then(jsonify)
  .then(function(){
    console.log("Upload and AudioProcessing complete");
        res.writeHead(200,
      {Location: 'http://localhost:8080/results'}
    );
    response.end();
  })

}

function convertAudio(fileName){
  var args = getTagAndType(fileName);
  var process = spawn('python',["./WavConverter.py", args.tag, args.type])
}

function convertAudio(fileName){
  var args = getTagAndType(fileName);
  var process = spawn('python',["./WavConverter.py", args.tag, args.type])
}


function getTagAndType(fileName) {

  periodIndex = fileName.lastIndexOf('.');

  return {
    tag: fileName.substring(0,periodIndex),
    type: fileName.substring(periodIndex+1,fileName.length)
  }
}
