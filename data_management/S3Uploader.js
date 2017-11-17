/*
This module looks for a wav file and uploads it to S3
*/

var AWS = require('aws-sdk')
var fs = require('fs');


exports.S3Upload = function(file){

  return new Promise(function(resolve,reject){

    // authorize aws upload
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION
    });

    // Read in the file, convert it to base64, store to S3
    fs.readFile('/tmp/'+ file.tag + '.wav', function (err, data) {
      if (err) { reject(err); }

      console.log(file)

      var base64data = new Buffer(data, 'binary');

      var s3 = new AWS.S3();
      s3.upload({
        Bucket: process.env.S3_BUCKET,
        Key: file.tag + '.wav',
        Body: base64data,
        ACL: 'public-read'
      },function (resp) {
        console.log('Successfully uploaded package.');
        resolve(file);
      });
    });
  });

}
