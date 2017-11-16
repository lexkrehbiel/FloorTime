/*
  This module runs the diarization pipeline on the given fileName
  When this script finishes, data/json/<fileName-extension>.json will be ready
  to source charts with data
*/

var shell = require('shelljs');

exports.single = function(input) {

  // promise to diarize
  return new Promise(function(resolve,reject){

      var fileName = input.files;

      // separate the file into it's name and extension
      periodIndex = fileName.lastIndexOf('.');
      tag = fileName.substring(0,periodIndex);
      type = fileName.substring(periodIndex+1,fileName.length);
      // transfer control to the command line, calling the python script for diarization
      shell.exec('python '+__dirname+ '/DiarizationPipeline.py '+input.name+' '+tag+' '+type, function(err,results){
        if (err) reject(err);

        // return the name of the file generated
        else {
          console.log(' finished diarization');
          resolve({
            tag: input.name,
            ext: type
          });
        }
      })
  });

}


exports.multi = function(input) {

  // promise to diarize
  return new Promise(function(resolve,reject){

      var fileNames = input.files;

      console.log('running diarizations');

      var command = " "+input.name+" ";

      // go through each file given
      fileNames.forEach(function(fileName){

        // separate the file into it's name and extension
        periodIndex = fileName.lastIndexOf('.');
        tag = fileName.substring(0,periodIndex);
        type = fileName.substring(periodIndex+1,fileName.length);

        // add this file and extension to the command
        command += tag + " " + type + " ";

      });

      // transfer control to the command line, calling the python script for diarization
      shell.exec('python '+__dirname+ '/DiarizationPipelineMulti.py '+command, function(err,results){
        if (err) reject(err);

        // return the name of the file generated
        else {
          console.log(' finished diarization');
          resolve({
            tag: input.name,
            ext: "mp3",
            files: fileNames
          });
        }
      })
  });

}
