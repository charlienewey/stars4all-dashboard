var data_path = "../data/project_health.json";
var key = "DistributionOfEffort";
var chart = null;

window.onresize = function () {
  chart.draw(0, true);
};

var svg = dimple.newSvg("#chartContainer", "100%", "100%");
d3.json(data_path, function (projects) {
  var chartData = [];

  // put data into the correct format...
  projects.map(function (d) {
    for (let i = 0; i < d.ProjectAppeal.length; i += 1) {
      chartData.push({
        "Project": d.Name,
        "Date": d.ProjectAppeal[i][0],
        "ProjectAppeal": d.ProjectAppeal[i][1],
        "DistributionOfEffort": d.DistributionOfEffort[i][1],
        "PublicContribution": d.PublicContribution[i][1],
        "SustainedEngagement": d.SustainedEngagement[i][1]
      });
    }
  });

  chart = new dimple.chart(svg, chartData);

  var x = chart.addTimeAxis("x", "Date", "%Y-%m-%d", "%Y-%m-%d");
  x.tickFormat = d3.timeFormat("%Y-%m");
  x.timePeriod = d3.timeMonth;
  x.timeInterval = 3;

  var y = chart.addMeasureAxis("y", key, Math.E);
  y.useLog = true;

  var s = chart.addSeries("Project", dimple.plot.line);
  s.interpolation = "monotone";

  chart.addLegend("10%", "5%", "80%", "20%", "right");
  chart.draw();
});
