const url =
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

document.addEventListener("DOMContentLoaded", () => {
  fetch(url).
  then(response => response.json()).
  then(data => {
    const dataset = data.data;

    // Dimensions
    const width = 800;
    const height = 400;
    const padding = 60;

    // Create SVG
    const svg = d3.
    select("#canvas").
    attr("width", width).
    attr("height", height);

    // Scales
    const xScale = d3.
    scaleTime().
    domain([
    d3.min(dataset, d => new Date(d[0])),
    d3.max(dataset, d => new Date(d[0]))]).

    range([padding, width - padding]);

    const yScale = d3.
    scaleLinear().
    domain([0, d3.max(dataset, d => d[1])]).
    range([height - padding, padding]);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.
    append("g").
    attr("id", "x-axis").
    attr("transform", `translate(0, ${height - padding})`).
    call(xAxis);

    svg.
    append("g").
    attr("id", "y-axis").
    attr("transform", `translate(${padding}, 0)`).
    call(yAxis);

    // Bars
    svg.
    selectAll("rect").
    data(dataset).
    enter().
    append("rect").
    attr("class", "bar").
    attr("data-date", d => d[0]).
    attr("data-gdp", d => d[1]).
    attr("x", d => xScale(new Date(d[0]))).
    attr("y", d => yScale(d[1])).
    attr("width", (width - 2 * padding) / dataset.length).
    attr("height", d => height - padding - yScale(d[1])).
    on("mouseover", (event, d) => {
      const tooltip = d3.select("#tooltip");
      tooltip.
      style("display", "block").
      style("left", event.pageX + 10 + "px").
      style("top", event.pageY - 25 + "px").
      attr("data-date", d[0]).
      html(`<strong>${d[0]}</strong><br>$${d[1]} Billion`);
    }).
    on("mouseout", () => {
      d3.select("#tooltip").style("display", "none");
    });
  });
});