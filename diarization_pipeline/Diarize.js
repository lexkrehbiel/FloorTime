/*
  This module runs the diarization pipeline on the given fileName
  When this script finishes, data/json/<fileName-extension>.json will be ready
  to source charts with data
*/

var shell = require('shelljs');

exports.run = function(fileName) {

  // promise to diarize
  return new Promise(function(resolve,reject){

      console.log('running diarization');

      // separate the file into it's name and extension
      periodIndex = fileName.lastIndexOf('.');
      tag = fileName.substring(0,periodIndex);
      type = fileName.substring(periodIndex+1,fileName.length);

      // transfer control to the command line, calling the python script for diarization
      shell.exec('python '+__dirname+ '/DiarizationPipeline.py '+tag+' '+' type', function(err,results){
        if (err) reject(err);

        // return the name of the file generated
        else {
          console.log(' finished diarization');
          resolve(tag+'.json');
        }
      })
  });

}
