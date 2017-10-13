/*
  This module takes the data variable (which will contain the diarized JSON data)
  and renders it as a timeline using the google charts API
*/

// load google charts
google.charts.load("current", {packages:["timeline"]});

// tell google charts to draw the chart when it's done loading
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  // identify the div to insert the timeline
  var container = document.getElementById('timeline');

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
