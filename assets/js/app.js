// @TODO: YOUR CODE HERE!

// Defining the margins

    var margin = {top: 20, right: 20, bottom: 70, left: 90},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.poverty;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10);

// setup y
var yValue = function(d) { return d.healthcare;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.state;},
    color = d3.scale.category10();

// add the graph canvas to the scatter tag of the webpage
var svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// read the data from csv and make the conversion from string to number
d3.csv("assets/data/data.csv", function(error, data) {

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.healthcare = +d.healthcare;
      d.poverty = +d.poverty;
      console.log(d);
    });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-3, d3.max(data, xValue)+5]);
  yScale.domain([d3.min(data, yValue)-3, d3.max(data, yValue)+5]);

  // define x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", +50)
      .style("font-size", "20px")
      .style("text-anchor", "end")
      .text("In Poverty (%)");

  // define y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -80)
      .attr("y", -60)
      .style("font-size", "20px")
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Lacks Healthcare (%)");
    
  // define title
      svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 30 - (margin.top))
      .attr("text-anchor", "middle")  
      .style("font-size", "32px") 
      .style("text-decoration", "underline")  
      .text("Poverty Vs Lacks Healthcare");

 // mark the ticks
      svg.selectAll('.axis line, .axis path')
     .style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '3px'});

  // draw scatter circles
  svg.selectAll("circle")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 10)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["state"] + "<br/> (" + xValue(d) 
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX - 50) + "px")
               .style("top", (d3.event.pageY - 70) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

// embed the state abbreviations in the circles
      var circleLabels = svg.selectAll(null).data(data).enter().append("text");
      circleLabels
        // .attr("x", (d) => (d[3]))
        // .attr("y", (d) => (d[9]))
        .attr("x", function(d) {
            return xScale(d.poverty);
          })
          .attr("y", function(d) {
            return yScale(d.healthcare);
          })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-weight", 800)
        .style("font-size", 8)
        .attr("dy", ".35em")
        .text(d => d.abbr);
});