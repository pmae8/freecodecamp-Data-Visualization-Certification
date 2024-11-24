// Fetch the data
const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

d3.json(url).then(data => {
  const width = 960;
  const height = 500;

  const svg = d3.select("#chart").append("svg").
  attr("width", width).
  attr("height", height);

  const root = d3.hierarchy(data).
  sum(d => d.value);

  d3.treemap().
  size([width, height])(
  root);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Tiles
  svg.selectAll("g").
  data(root.leaves()).
  enter().append("g").
  attr("transform", d => `translate(${d.x0},${d.y0})`).
  each(function (d) {
    // Append rectangle
    d3.select(this).append("rect").
    attr("class", "tile").
    attr("id", d => d.data.name).
    attr("data-name", d => d.data.name).
    attr("data-category", d => d.data.category).
    attr("data-value", d => d.data.value).
    attr("width", d => d.x1 - d.x0).
    attr("height", d => d.y1 - d.y0).
    style("fill", d => color(d.data.category)).
    on("mouseover", function (event, d) {
      d3.select("#tooltip").
      style("opacity", 1).
      attr("data-value", d.data.value).
      html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: $${d.data.value}`);
      d3.select(this).style("opacity", 0.7);
    }).
    on("mouseout", function () {
      d3.select("#tooltip").style("opacity", 0);
      d3.select(this).style("opacity", 1);
    });

    // Append label
    d3.select(this).append("text").
    attr("x", 5) // Padding from the left
    .attr("y", 20) // Padding from the top
    .style("fill", "white") // Text color
    .text(d.data.name).
    attr("font-size", "0.8em") // Smaller font size for better fit
    .attr("font-family", "Arial"); // Font Family
  });

  // Tooltip Position
  d3.select("#tooltip").
  style("left", d3.event.pageX + 5 + "px").
  style("top", d3.event.pageY - 28 + "px");

  // Legend
  const categories = [...new Set(data.children.map(d => d.name))];
  const legend = d3.select("#legend");

  categories.forEach((category, i) => {
    legend.append("div").
    attr("class", "legend-item").
    style("display", "flex").
    append("rect").
    attr("class", "legend-item").
    attr("fill", color(category)).
    attr("width", 20).
    attr("height", 20);
    legend.append("span").text(category);
  });
});