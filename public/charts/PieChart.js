
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  var data = google.visualization.arrayToDataTable([
    ['Speaker', 'Minutes'],
    ['Tom',     11],
    ['Joe',      2],
    ['Kelsey',  2],
    ['Stuart', 2],
    ['Jack',    7]
  ]);

  var options = {
    title: 'Floor Time by Speaker'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}
