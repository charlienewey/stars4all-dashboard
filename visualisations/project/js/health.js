// Various accessors that specify the four dimensions of data to visualize.
// name, contribution, appeal, engagement, effort
function x(d) { return d.appeal; }
function y(d) { return d.engagement; }
function radius(d) { return d.effort; }
function color(d) { return d.name; }
function key(d) { return d.name; }

var dateSpecifier = "%Y-%m-%d";
var dateParse = d3.timeParse(dateSpecifier);
var dateFormat = d3.timeFormat(dateSpecifier);
var startDate = dateParse("2014-10-01");
var endDate = dateParse("2017-06-01");

// Chart dimensions.
var margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 100
};

var width = 960 - margin.right;
var height = 500 - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scaleLinear().domain([0, 5e-2]).range([0, width]);
var yScale = d3.scaleLinear().domain([0, 5e-2]).range([height, 0]);
var radiusScale = d3.scaleSqrt().domain([0, 1e-1]).range([0, 20]);
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// The x & y axes.
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

// Create the SVG container and set the origin.
var svg = d3.select("#healthChart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

// Add the y-axis.
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

// Add an x-axis label.
svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height - 6)
  .text("project appeal");

// Add a y-axis label.
svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("sustained engagement");

// Add the date label; the value is set on transition.
var label = svg.append("text")
  .attr("class", "date label")
  .attr("text-anchor", "end")
  .attr("y", height - 24)
  .attr("x", width)
  .text(dateFormat(startDate));

// Load the data.
d3.json("../data/project_health.json", function(projects) {
  // A bisector since data may be sparse.
  var bisect = d3.bisector(function(d) { return dateParse(d[0]); });

  // Add a dot per project, initialise data, and set colours.
  var dot = svg.append("g")
    .attr("class", "dots")
    .selectAll(".dot")
    .data(interpolateData(startDate))
    .enter().append("circle")
    .attr("class", "dot")
    .style("fill", function(d) { return colorScale(color(d)); })
    .call(position)
    .sort(order);

  // Add a title.
  dot.append("title")
    .text(function(d) { return d.name; });

  // Add an overlay for the date label.
  var box = label.node().getBBox();

  var overlay = svg.append("rect")
    .attr("class", "overlay")
    .attr("x", box.x)
    .attr("y", box.y)
    .attr("width", box.width)
    .attr("height", box.height)
    .on("mouseover", enableInteraction);

  // Start a transition that interpolates the data based on date.
  svg.transition()
    .duration(100000)
    .ease(d3.easeLinear)
    .tween("date", tweenDate);

  // Positions the dots based on data.
  function position(dot) {
    dot.attr("cx", function(d) { return xScale(x(d)); })
       .attr("cy", function(d) { return yScale(y(d)); })
       .attr("r", function(d) { return radiusScale(radius(d)); });
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return radius(b) - radius(a);
  }

  // After the transition finishes, you can mouseover to change the date.
  function enableInteraction() {
    var dateScale = d3.scaleLinear()
      .domain([startDate, endDate])
      .range([box.x + 10, box.x + box.width - 10])  // interactive mouseover date scale
      .clamp(true);

    // Cancel the current transition, if any.
    svg.transition().duration(0);

    overlay
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("mousemove", mousemove)
      .on("touchmove", mousemove);

    function mouseover() {
      label.classed("active", true);
    }

    function mouseout() {
      label.classed("active", false);
    }

    function mousemove() {
      var date = new Date(dateScale.invert(d3.mouse(this)[0]));
      displayDate(date);
    }
  }

  // Tweens the entire chart by first tweening the date, and then the data.
  // For the interpolated data, the dots and label are redrawn.
  function tweenDate() {
    var date = d3.interpolateDate(startDate, endDate);
    return function(t) { displayDate(date(t)); };
  }

  // Updates the display to show the specified date.
  function displayDate(date) {
    dot.data(interpolateData(date), key).call(position).sort(order);
    label.text(dateFormat(new Date(date)));
  }

  // Interpolates the dataset for the given (fractional) date.
  var a = 0;
  function interpolateData(date) {
    return projects.map(function(d) {
      var data = {
        name: d.Name,
        contribution: interpolateValues(d.PublicContribution, date),
        engagement: interpolateValues(d.SustainedEngagement, date),
        appeal: interpolateValues(d.ProjectAppeal, date),
        effort: interpolateValues(d.DistributionOfEffort, date)
      };

      a += 1;
      if (a % 11 == 0) {
        // draw dot trail for each project
        svg.append("circle")
          .datum(data)
          .attr("cx", function(d) { return xScale(x(d)); })
          .attr("cy", function(d) { return yScale(y(d)); })
          .attr("r", 3)
          .attr("fill", function(d) { return colorScale(color(d)); });
      }

      return data;
    });
  }

  // Finds (and possibly interpolates) the value for the specified year.
  function interpolateValues(values, date) {
    var i = bisect.left(values, date, 0, values.length - 1);
    var a = values[i];
    if (i > 0) {
      var b = values[i - 1];
      var ta = dateParse(a[0]);
      var tb = dateParse(b[0]);
      var t = (date - ta) / (tb - ta);
      return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
  }
});

