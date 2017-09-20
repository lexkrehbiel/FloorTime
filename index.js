var express = require('express');
var app = express();
// var engines = require('consolidate');
var router = express.Router();
var viewPath = __dirname+"/views/";
var dataPath = __dirname+"/data/json/"
// require('ejs')
// var results = require('./charts/StackedBarChart.js')

var upload = require('./diarization_pipeline/Upload.js').run;
var diarize = require('./diarization_pipeline/Diarize.js').run;

var fs = require('fs');

app.engine('html', require('ejs').renderFile);

app.use('/static',express.static('public'))

// you put it here, not assign it every request to /
// app.use(express.static('public'));
// // app.use("/css", express.static(__dirname + '/css'));
// // app.use("/color", express.static(__dirname + '/color'));
// app.use("/font-awesome", express.static(__dirname + '/font-awesome'));
// // app.use("/fonts", express.static(__dirname + '/fonts'));
// // app.use("/img", express.static(__dirname + '/img'));
// app.use("/charts", express.static(__dirname + '/js'));
// app.use("/node_modules", express.static(__dirname + '/node_modules'));

router.use('/upload',function(req,res,next){

  upload(req, res)
  .then(diarize)
  .then(function(jsonFileName){
    console.log('got through upload and diarize');
    res.redirect('/results/'+jsonFileName);
    res.end();
    next();
  }).catch(function(err){
    console.log("error");
    console.log(err);
    res.render(viewPath+'results.html',{data: JSON.stringify(err)});
    res.end();
    next();
  });
});

router.use('/results/:jsonData',function(req,res,next){
  console.log('looking to show results!');
  var fileName = req.params.jsonData;
  console.log(fileName)
  var data = fs.readFileSync(dataPath+fileName, 'utf8');
  // res.send(JSON.stringify(data));
  res.render(viewPath+'results.html',{data: data});
  next();
  // results.run(data);
  // next();

})

router.get("/",function(req,res){
  res.sendFile(viewPath+'index.html')
});

// app.get('/',function(req,res){
//   res.render('index.html');
//
// });

app.use("/", router);

// app.use('*',function(req,res){
//   res.send(req.url+' is not a valid URL');
// })

// run server on port 8080
app.listen(8080,function(){
  console.log("LIVE ON 8080")
});
