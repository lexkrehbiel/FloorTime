/*This module performs the insert into the mongo database*/

var mongoClient = require('mongodb').MongoClient;
var mongo_url = "mongodb://ft_admin:ftadmin@ds159235.mlab.com:59235/floortime";

// look for the files in the s3 bucket
var audio_url = 'https://'+process.env.S3_BUCKET+'.s3.'+process.env.S3_REGION+'.amazonaws.com/';

exports.get = function(tag){

  // promise to get the data with the given tag from the database
  return new Promise(function(resolve,reject){

      // connect to the db
      mongoClient.connect(mongo_url, function(err, db) {
        if (err) throw reject(err);

        // query sessions for the tag
        db.collection("sessions").findOne({name : tag}, function(err, result) {
          if (err) throw reject(err);

          // close database
          db.close();

          // return the data
          resolve(result);
        });
      });
  });

}

exports.insert = function(file){

  // promise to insert into the database
  return new Promise(function(resolve,reject){

    // insert data into db
    console.log("inserting data into db at "+file.tag);

    // get the json file's data
    var data = require('/tmp/'+file.tag);

    // connect to mongo
    mongoClient.connect(mongo_url, function(err, db) {

      // break on error
      if (err) reject(err);

      // generate session data, attaching the found data
      var session = {
          name : file.tag,
          wav  : audio_url+file.tag+".wav",
          data : data
      }

      // connect to the sessions table and insert
      db.collection("sessions").insertOne(session, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted:");
        console.log(session);
        db.close();

        // return the tag name used for redirect
        resolve(file);
      });
    });


   });
}
