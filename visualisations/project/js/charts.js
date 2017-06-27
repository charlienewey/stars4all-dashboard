var svg = dimple.newSvg("#chartContainer", 590, 400);

var key = "DistributionOfEffort";

d3.json("../data/project_health.json", function (projects) {
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

  var chart = new dimple.chart(svg, chartData);
  chart.setBounds(60, 30, 505, 305);

  var x = chart.addTimeAxis("x", "Date", "%Y-%m-%d", "%Y-%m");
  x.tickFormat = d3.timeFormat("%Y-%m-%d");
  x.timePeriod = d3.timeMonth;
  x.timeInterval = 3;

  var y = chart.addMeasureAxis("y", key, Math.E);
  y.useLog = true;

  var s = chart.addSeries("Project", dimple.plot.line);
  s.interpolation = "monotone";

  chart.addLegend(60, 10, 500, 20, "right");
  chart.draw();
});
