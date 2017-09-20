// /usr/bin/java -Xmx2024m -jar ./lium.jar \ --fInputMask=../audio/hands.wav --sOutputMask=./hands.seg --doCEClustering  hands
// /usr/bin/java -Xmx2024m -jar ./lium.jar \
//  --fInputMask=../audio/hands.wav --sOutputMask=./hands.seg --doCEClustering  hands
// var app = angular.module('APP', []);
//
// app.controller('StackedBar',StackedBar)
//
// function StackedBar($scope, $http) {
//
//   $http.get('/results').then(function(response){
//
//     console.log(response);
//
//    // You will get the above response here  in response.data
//
//   })

  // var rawData = $('#data').data();
  // console.log(rawData);
  //
  // var data = JSON.parse(rawData);
  //
  // console.log(data);

  // data = JSON.parse(data)

  console.log(data);

  // var data = {"segments": [{"start": "34", "gender": "F", "environment": "U", "band": "S", "length": "1046", "channelNumber": "1", "speaker": "S0", "showName": "hands"}, {"start": "1082", "gender": "F", "environment": "U", "band": "S", "length": "579", "channelNumber": "1", "speaker": "S0", "showName": "hands"}, {"start": "3704", "gender": "M", "environment": "U", "band": "S", "length": "236", "channelNumber": "1", "speaker": "S11", "showName": "hands"}, {"start": "7942", "gender": "M", "environment": "U", "band": "S", "length": "841", "channelNumber": "1", "speaker": "S11", "showName": "hands"}, {"start": "12358", "gender": "M", "environment": "U", "band": "S", "length": "575", "channelNumber": "1", "speaker": "S11", "showName": "hands"}, {"start": "17119", "gender": "M", "environment": "U", "band": "S", "length": "596", "channelNumber": "1", "speaker": "S11", "showName": "hands"}, {"start": "8783", "gender": "F", "environment": "U", "band": "S", "length": "200", "channelNumber": "1", "speaker": "S13", "showName": "hands"}, {"start": "8993", "gender": "F", "environment": "U", "band": "S", "length": "1813", "channelNumber": "1", "speaker": "S13", "showName": "hands"}, {"start": "10806", "gender": "F", "environment": "U", "band": "S", "length": "1552", "channelNumber": "1", "speaker": "S13", "showName": "hands"}, {"start": "12933", "gender": "F", "environment": "U", "band": "S", "length": "250", "channelNumber": "1", "speaker": "S19", "showName": "hands"}, {"start": "13210", "gender": "F", "environment": "U", "band": "S", "length": "595", "channelNumber": "1", "speaker": "S19", "showName": "hands"}, {"start": "1661", "gender": "F", "environment": "U", "band": "S", "length": "930", "channelNumber": "1", "speaker": "S2", "showName": "hands"}, {"start": "2591", "gender": "F", "environment": "U", "band": "S", "length": "1113", "channelNumber": "1", "speaker": "S2", "showName": "hands"}, {"start": "3940", "gender": "F", "environment": "U", "band": "S", "length": "637", "channelNumber": "1", "speaker": "S2", "showName": "hands"}, {"start": "4577", "gender": "F", "environment": "U", "band": "S", "length": "1454", "channelNumber": "1", "speaker": "S2", "showName": "hands"}, {"start": "6031", "gender": "F", "environment": "U", "band": "S", "length": "1911", "channelNumber": "1", "speaker": "S2", "showName": "hands"}, {"start": "14008", "gender": "F", "environment": "U", "band": "S", "length": "1083", "channelNumber": "1", "speaker": "S21", "showName": "hands"}, {"start": "15266", "gender": "F", "environment": "U", "band": "S", "length": "1545", "channelNumber": "1", "speaker": "S21", "showName": "hands"}], "meta": [{"MTScore": "-34.779809619763796", "FSScore": "-32.242623588952476", "speaker": "S0", "MSScore": "-34.107825883087166", "FTScore": "-33.53510665016705"}, {"MTScore": "-Infinity", "FSScore": "-Infinity", "speaker": "S11", "MSScore": "-Infinity", "FTScore": "-Infinity"}, {"MTScore": "-33.96871641045701", "FSScore": "-32.44537490653893", "speaker": "S13", "MSScore": "-33.63396124392409", "FTScore": "-33.02633471452576"}, {"MTScore": "-34.62661652991769", "FSScore": "-33.28021955642785", "speaker": "S19", "MSScore": "-34.14420416240183", "FTScore": "-33.88896822706336"}, {"MTScore": "-34.11922407217122", "FSScore": "-32.65295204913604", "speaker": "S2", "MSScore": "-33.75326645491462", "FTScore": "-33.21708574747635"}, {"MTScore": "-34.181040938775844", "FSScore": "-32.678210208812565", "speaker": "S21", "MSScore": "-33.68832256503517", "FTScore": "-33.26757146329487"}]};

  // load google charts
  google.charts.load("current", {packages:["timeline"]});

  // tell google charts to draw the chart when it's done loading
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {

    // identify the div to insert the timeline
    var container = document.getElementById('tl');

    // create a chart
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Speaker' });
    dataTable.addColumn({ type: 'string', id: 'Gender' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    var count = 0;
    data.segments.forEach(function(seg){
      count++;
      retval = [
        seg.gender,
        seg.speaker,
        new Date(10.18181818*(seg.start*1)),
        new Date(10.18181818*(seg.start*1+ seg.length*1))
      ];
      dataTable.addRow(retval);
    });

    chart.draw(dataTable);
  }


// }
