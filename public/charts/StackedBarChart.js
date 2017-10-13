/*
  This module takes the data variable (which will contain the diarized JSON data)
  and renders it as a timeline using the google charts API
*/

// load google charts
google.charts.load("current", {packages:["timeline"]});

// tell google charts to draw the chart when it's done loading
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  // cutoff for when to combine speaker chunks
  var SMOOTHING_CUTOFF = 1000*10; // 10 seconds

  // sort the audio segments
  var segments = data.segments.sort(function(s1,s2){
    return (1*s1.start)-(1*s2.start);
  });


  var smoothedSegments = [];
  var last_end;
  var last_speaker;
  var last;

  // traverse the sorted segments, combining those that are close together
  // and converting to google-API-friendly format
  segments.forEach(function(seg){

    // convert features to milliseconds
    var start = 10*seg.start*1;
    var end = 10*(seg.start*1+ seg.length*1);

    // if this should be a new segment
    if(smoothedSegments.length == 0 || start-last_end > SMOOTHING_CUTOFF || last_speaker != seg.speaker){

      // save the speaker
      last_speaker = seg.speaker;

      // add a new row to the list
      retval = [
        //seg.gender,
        "All",
        seg.speaker,
        milliToDate(start),
        milliToDate(end)
      ];
      smoothedSegments.push(retval);
    }

    // otherwise
    else {

      // update the endtime of the last saved segment
      var i = smoothedSegments.length-1;
      smoothedSegments[i][3] = milliToDate(end);
    }

    // save the end
    last_end = end;
  });


  // identify the div to insert the timeline
  var container = document.getElementById('timeline');

  // create a chart
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'Speaker' });
  dataTable.addColumn({ type: 'string', id: 'A' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });

  // add the processed segments to the dataTable
  smoothedSegments.forEach(function(arr){
    dataTable.addRow(arr);
  })

  chart.draw(dataTable);


  // REPEAT FOR EXPANDED
  // identify the div to insert the timeline
  var container = document.getElementById('timeline-exp');

  // create a chart
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'Speaker' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });

  // add the processed segments to the dataTable
  smoothedSegments.forEach(function(arr){
    var val = [];
    for(let i=1; i<4; i++){
      val.push(arr[i]);
    }
    dataTable.addRow(val);
  })

  chart.draw(dataTable);
}

// convert milliseconds value to a date
function milliToDate(value){
  var oval = value;
  var ms = value % 1000;
  value = (value-ms)/1000;
  var sec = value % 60;
  value = (value-sec)/60;
  var min = value % 60;
  value = (value-min)/60;
  var hour = value;
  return new Date(0,0,0,hour,min,sec);
}
