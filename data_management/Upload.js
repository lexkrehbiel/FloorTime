/*This moudle performs the upload, returning the name of the file uploaded*/

// node imports
var formidable = require('formidable');
var fs = require('fs');

exports.single = function(req,res){

  // promise to perform the upload
  return new Promise(function(resolve,reject){

    console.log('running upload');

    // generate a new form
    var form = new formidable.IncomingForm();

    // parse the form
    form.parse(req, function (err, fields, files) {

      // upload the given file
      single_upload(files.filetoupload)

      // resolve the result
      .then(function(result){
        console.log("uploaded!");
        resolve({
          name: '_'+(new Date()).getTime(),
          files:result
        });
      })

   });
  })

}

exports.multi = function(req,res){

  // promise to perform the upload
  return new Promise(function(resolve,reject){

    console.log('running uploads');

    // generate a new form
    var form = new formidable.IncomingForm();

    form.multiples = true;

    // parse the form
    form.parse(req, function (err, fields, files) {

      // ensure that the inputs are an array
      var files_found = files.filesToUpload;
      if(!Array.isArray(files_found)){
        files_found = [files_found];
      }

      // generate promises for each file
      var filePromises = files_found.map(single_upload);

      // run all the promises
      Promise.all(filePromises)

      // return the results
      .then(function(results){
        resolve({
          name: '_'+(new Date()).getTime(),
          files:results
        });
      })
    });
  });

}

// promise to upload a single file
function single_upload(file){

  return new Promise(function(resolve,reject){

      // get the file's path
      var oldpath = file.path;

      // generate the new path
      var newFileName = file.name;
      var newpath = '/tmp/' + newFileName;

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
}
