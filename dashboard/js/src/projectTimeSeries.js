import * as dimple from 'dimple';
import * as d3 from 'd3';

var project_name = "DarkSkies";
var data_path = "../data/project_health.json";

window.onload = function () {
  // create all four charts
  drawChart("#projectAppeal", project_name, "ProjectAppeal");
  drawChart("#distributionOfEffort", project_name, "DistributionOfEffort");
  drawChart("#sustainedEngagement", project_name, "SustainedEngagement");
  drawChart("#publicContribution", project_name, "PublicContribution");
}

function drawChart(container, projectName, feature) {
  var svg = dimple.newSvg(container, "80%", "100%");
  d3.json(data_path, function (projects) {
    var chartData = [];

    // put data into the correct format...
    projects.map(function (d) {
      for (var i = 0; i < d.ProjectAppeal.length; i += 1) {
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

    // filter the data to only include the relevant project
    chartData = dimple.filterData(chartData, "Project", projectName);

    // draw chart, set up axes, etc
    var chart = new dimple.chart(svg, chartData);
    chart.setMargins("50px", "50px", 0, "50px");

    var x = chart.addTimeAxis("x", "Date", "%Y-%m-%d", "%Y-%m-%d");
    x.tickFormat = d3.timeFormat("%Y-%m");
    x.timePeriod = d3.timeMonth;
    x.timeInterval = 3;

    var y = chart.addMeasureAxis("y", feature, Math.E);
    y.useLog = true;

    var s = chart.addSeries("Project", dimple.plot.line);
    s.interpolation = "monotone";

    chart.addLegend("10%", "5%", "80%", "20%", "right");
    chart.draw();
  });
}
