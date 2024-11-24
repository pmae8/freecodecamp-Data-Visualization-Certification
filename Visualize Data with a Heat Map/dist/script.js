const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then(data => {
  const temperatures = data.monthlyVariance;
  const baseTemperature = data.baseTemperature;

  // Constants
  const margin = { top: 50, right: 30, bottom: 70, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Create SVG canvas
  const svg = d3.select("#heatmap").
  append("g").
  attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up scales
  const xScale = d3.scaleBand().
  domain(temperatures.map(d => d.year)).
  range([0, width]).
  padding(0.01);

  const yScale = d3.scaleBand().
  domain(temperatures.map(d => d.month)).
  range([0, height]).
  padding(0.01);

  const colorScale = d3.scaleSequential(d3.interpolateRdYlBu).
  domain(d3.extent(temperatures, d => baseTemperature + d.variance));

  // Create axes
  svg.append("g").
  attr("id", "x-axis").
  attr("transform", `translate(0, ${height})`).
  call(d3.axisBottom(xScale).tickValues([...Array(263).keys()].map(i => i + 1754).filter((year, i) => i % 5 === 0))).
  selectAll("text").
  style("font-size", "12px") // Adjust font size for x-axis
  .style("fill", "#333"); // Axis text color

  svg.append("g").
  attr("id", "y-axis").
  call(d3.axisLeft(yScale).tickFormat(d => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[d - 1];
  })).
  selectAll("text").
  style("font-size", "12px") // Adjust font size for y-axis
  .style("fill", "#333"); // Axis text color

  // Create cells
  svg.selectAll(".cell").
  data(temperatures).
  enter().
  append("rect").
  attr("class", "cell").
  attr("data-month", d => d.month - 1).
  attr("data-year", d => d.year).
  attr("data-temp", d => baseTemperature + d.variance).
  attr("x", d => xScale(d.year)).
  attr("y", d => yScale(d.month)).
  attr("width", xScale.bandwidth()).
  attr("height", yScale.bandwidth()).
  attr("fill", d => colorScale(baseTemperature + d.variance)).
  on("mouseover", function (event, d) {
    d3.select("#tooltip").
    style("opacity", 1).
    attr("data-year", d.year).
    html(`${d.year} - ${d3.timeFormat("%B")(new Date(0, d.month - 1))}<br>${(baseTemperature + d.variance).toFixed(2)}°C`).
    style("left", event.pageX + 5 + "px").
    style("top", event.pageY - 28 + "px");
  }).
  on("mouseout", function () {
    d3.select("#tooltip").style("opacity", 0);
  });

  // Create legend
  const legendWidth = 250;
  const legendHeight = 20;

  const legend = d3.select("#legend").
  append("svg").
  attr("width", legendWidth).
  attr("height", legendHeight);

  const legendScale = d3.scaleLinear().
  domain([baseTemperature + d3.min(temperatures, d => d.variance), baseTemperature + d3.max(temperatures, d => d.variance)]).
  range([0, legendWidth]);

  const legendAxis = d3.axisBottom(legendScale).
  ticks(5).
  tickFormat(d => d.toFixed(1));

  legend.append("g").
  attr("transform", "translate(0, 20)").
  call(legendAxis);

  legend.selectAll(".legend-item").
  data(colorScale.range()).
  enter().
  append("rect").
  attr("class", "legend-item").
  attr("x", (d, i) => i * (legendWidth / colorScale.range().length)).
  attr("y", 0).
  attr("width", legendWidth / colorScale.range().length).
  attr("height", legendHeight).
  attr("fill", d => d);
});