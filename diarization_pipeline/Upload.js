/*This moudle performs the upload, returning the name of the file uploaded*/

// node imports
var formidable = require('formidable');
var fs = require('fs');

exports.run = function(req,res){

  // promise to perform the upload
  return new Promise(function(resolve,reject){

    console.log('running upload');

    // generate a new form
    var form = new formidable.IncomingForm();

    // parse the form
    form.parse(req, function (err, fields, files) {

      // get the old path (the temp path)
      var oldpath = files.filetoupload.path;

      // strip the last directory off
      var lastDirIndex = __dirname.lastIndexOf('/');
      var parent = __dirname.substring(0,lastDirIndex);

      // determine the directory
      var directory = parent+'/data/audio/';

      // generate the new path
      var newFileName = files.filetoupload.name;
      var newpath = directory + newFileName;

      // move the file
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;

        // resolve the promise
        else {
          console.log('   finished upload');

          // return the new file's name
          resolve(newFileName);
        }
      });
   });
  })

}
