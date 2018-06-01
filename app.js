var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data/data.csv", function (err, demoData) {
  if (err) throw err;

  console.log(demoData);

  // Step 1: Parse Data/Cast as numbers
   // ==============================
  demoData.forEach(function (data) {
    data.id = +data.id;
    data.below_poverty = +data.below_poverty;
    data.diagnosed_diabetes = +data.diagnosed_diabetes;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(demoData, d => d.below_poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(demoData, d => d.diagnosed_diabetes)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(demoData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.below_poverty))
  .attr("cy", d => yLinearScale(d.diagnosed_diabetes))
  .attr("r", "5")
  .attr("fill", "blue")
  .attr("opacity", ".5");

  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 50)
  .attr("x", 0 - height + 200)
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("% Diagnosed with Diabetes");

  chartGroup.append("text")
  .attr("transform", "translate(" + (width/3) + "," + (height + margin.top + 30) + ")") 
  .attr("class", "axisText")
  .text("Poverty Rate (%)");
  
});
