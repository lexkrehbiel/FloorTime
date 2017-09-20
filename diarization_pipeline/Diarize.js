/*This moudle performs the upload and redirects to the charts page*/

// node imports
// var PythonShell = require('python-shell');
var shell = require('shelljs');

exports.run = function(fileName) {

  // generate the promise version of the upload function
  return new Promise(function(resolve,reject){

      console.log('running diarization');
      periodIndex = fileName.lastIndexOf('.');
      tag = fileName.substring(0,periodIndex);
      type = fileName.substring(periodIndex+1,fileName.length);

      // do diarize
      var options = {
        mode: 'text',
        scriptPath: __dirname+'/',
        pythonOptions: ['-u'],
        args: [tag, type]
      };

      // PythonShell.run('DiarizationPipeline.py', options, function (err, results) {
      //   if (err) {
      //     console.log(' error in diarization');
      //     reject(err);
      //   }
      //   // results is an array consisting of messages collected during execution
      //   else {
      //     console.log(' finished diarization');
      //     resolve(tag+'.json');
      //   }
      // });

      shell.exec('python '+__dirname+ '/DiarizationPipeline.py '+tag+' '+' type', function(err,results){
        if (err) {
          console.log(' error in diarization');
          console.log(err);
          reject(err);
        }
        // results is an array consisting of messages collected during execution
        else {
          console.log(' finished diarization');
          resolve(tag+'.json');
        }
      })
  });

}
