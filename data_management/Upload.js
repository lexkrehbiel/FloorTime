/*This moudle performs the upload, returning the name of the file uploaded*/

// node imports
var formidable = require('formidable');
var fs = require('fs');
const aws = require('aws-sdk');

// configure AWS & S3
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'eu-west-1';

exports.single = function(req,res){

  // promise to perform the upload
  return new Promise(function(resolve,reject){

    console.log('running upload');

    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    console.log(s3Params);

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      resolve(fileName)
      //res.end();
    });



    // generate a new form
  //   var form = new formidable.IncomingForm();
   //
  //   // parse the form
  //   form.parse(req, function (err, fields, files) {
   //
  //     // upload the given file
  //     single_upload(files.filetoupload)
   //
  //     // resolve the result
  //     .then(function(result){
  //       resolve(result);
  //     });
   //
  //  });
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
        resolve(results);
      })
    });
  });

}

// promise to upload a single file
function single_upload(file){

  return new Promise(function(resolve,reject){

      // get the file's path
      var oldpath = file.path;

      // strip the last directory off
      var lastDirIndex = __dirname.lastIndexOf('/');
      var parent = __dirname.substring(0,lastDirIndex);

      // determine the directory
      var directory = parent+'/data/audio/';

      // generate the new path
      var newFileName = file.name;
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
}
