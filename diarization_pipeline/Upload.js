/*This moudle performs the upload and redirects to the charts page*/

// node imports
var formidable = require('formidable');
var fs = require('fs');

exports.run = function(req,res){

  return new Promise(function(resolve,reject){

    console.log('running upload');

    // generate a new form
    var form = new formidable.IncomingForm();

    // parse the form
    form.parse(req, function (err, fields, files) {

      // get the old path (the temp path)
      var oldpath = files.filetoupload.path;

      // determine the directory
      var directory = '/Users/lexiekrehbiel/Documents/SrProject/FloorTime/data/audio/';

      // generate the new path
      var newFileName = files.filetoupload.name;
      var newpath = directory + newFileName;

      // move the file
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;

        // resolve the promise
        else {
          console.log('   finished upload');
          resolve(newFileName);
        }
      });
   });
  })

}
