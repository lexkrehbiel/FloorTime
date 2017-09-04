/*This moudle performs the upload and redirects to the charts page*/

// node imports
var formidable = require('formidable');
var fs = require('fs');
var config = require('config');

exports.run = function(req,res){

  console.log('running');

  // generate a new form
  var form = new formidable.IncomingForm();

  // parse the form
  form.parse(req, function (err, fields, files) {

    // get the old path (the temp path)
    var oldpath = files.filetoupload.path;

    // determine the directory from the config file
    var directory = config.get('Uploads.path');

    // generate the new path
    var newpath = directory + files.filetoupload.name;

    console.log('uploaded file will be placed in: ');
    console.log(newpath);

    // move the file
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });
 });
}
