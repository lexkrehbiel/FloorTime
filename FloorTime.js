/*

This module is server for FloorTime.
The server listens on a port and then does the following:
- generate a path string pointing to ./views/<urlName>
- check if ./views/<urlName>.html exists, show it if it does
- check if config/<yourConfigFile> has a driver mapping for this <urlName>
  - if it does, that mapping is the path to the driver js file for this url
  - this file is then loaded and run().
    - in other words, all driver files must implement exports.run()
*/

var http = require('http');
var fs = require('fs');
var config = require('config');

// generate the url to function mapping
var drivers = config.get("drivers");

http.createServer(function (req, res) {

  // parse url into a path for an html view
  var viewPath = './views';

  // if no url specified, show the index page
  if(req.url == '/'){
    viewPath += '/index.html';
  }
  // otherwise, attach the view that corresponds to the url
  else {
    viewPath += req.url+'.html'
  }

  console.log(req.url);

  // if there is a view file at the path we're looking at
  if(fs.existsSync(viewPath)){

    // load the file
    fs.readFile(viewPath, function(err, data) {

      console.log('read '+viewPath);

      // write the html
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);

      // if there's a corresponding js file to drive this url
      // (mapping given by the urls component in config)
      if(req.url in drivers){

        console.log('found drivers');

        // load the driver
        var driver = require('./'+drivers[req.url]);

        // finish by running the driver
        res.end( driver.run(req,res) );
      }

      // otherwise finish
      else {
        res.end();
      }
    });
  }
  // try the raw upload
  else if(fs.existsSync('.'+req.url)){

    console.log('loading raw');

    // load the file
    fs.readFile('.'+req.url, function(err, data) {

      console.log('loaded '+req.url);

      // write the data
      res.writeHead(200);
      res.write(data);
      res.end()
    });
  }

  // if the url is not in urls to serve, finish
  else {
    res.end();
  }

}).listen(8080);
