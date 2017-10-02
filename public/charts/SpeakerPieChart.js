
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  console.log(data);

  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'Speaker' });
  dataTable.addColumn({ type: 'number', id: 'Time' });

  spkrsAgg = {};
  data.segments.forEach(function(seg){
    if(!(seg.speaker in spkrsAgg)){
      spkrsAgg[seg.speaker] = 0;
    }

    spkrsAgg[seg.speaker] +=  1 * seg.length;

  });

  Object.keys(spkrsAgg).forEach(function(key){
    dataTable.addRow([
      key,
      spkrsAgg[key]
    ]);
  })

  var options = {
    title: 'Floor Time by Speaker'
  };

  var chart = new google.visualization.PieChart(document.getElementById('spkrpiechart'));

  chart.draw(dataTable, options);

}
