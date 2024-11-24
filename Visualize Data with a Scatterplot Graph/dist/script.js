const url =
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

document.addEventListener("DOMContentLoaded", () => {
  fetch(url).
  then(response => response.json()).
  then(data => {
    const dataset = data;

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
    scaleLinear().
    domain([
    d3.min(dataset, d => d.Year - 1),
    d3.max(dataset, d => d.Year + 1)]).

    range([padding, width - padding]);

    const yScale = d3.
    scaleTime().
    domain([
    d3.min(dataset, d => new Date(d.Seconds * 1000)),
    d3.max(dataset, d => new Date(d.Seconds * 1000))]).

    range([height - padding, padding]);

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

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

    // Dots
    svg.
    selectAll(".dot").
    data(dataset).
    enter().
    append("circle").
    attr("class", "dot").
    attr("data-xvalue", d => d.Year).
    attr("data-yvalue", d => {
      const date = new Date(d.Seconds * 1000);
      return date;
    }).
    attr("cx", d => xScale(d.Year)).
    attr("cy", d => yScale(new Date(d.Seconds * 1000))).
    attr("r", 5).
    attr("data-doping", d => d.Doping).
    attr("fill", d => d.Doping ? "#a333c8" : "#28a745").
    on("mouseover", (event, d) => {
      const tooltip = d3.select("#tooltip");
      tooltip.
      style("display", "block").
      style("left", event.pageX + 10 + "px").
      style("top", event.pageY - 25 + "px").
      attr("data-year", d.Year).
      html(
      `${d.Name}: ${d.Nationality}<br>
         Year: ${d.Year}, Time: ${d.Time}<br>
         ${d.Doping ? d.Doping : ""}`);

    }).
    on("mouseout", () => {
      d3.select("#tooltip").style("display", "none");
    });


    // Legend
    const legend = d3.select("#legend");

    // No Doping Allegations
    legend.
    append("div").
    attr("id", "legend-no-doping").
    style("display", "flex").
    style("align-items", "center").
    html(
    '<span class="dot legend-dot" style="background-color: #28a745;"></span> No Doping Allegations');


    // Doping Allegations
    legend.
    append("div").
    attr("id", "legend-doping").
    style("display", "flex").
    style("align-items", "center").
    html(
    '<span class="dot legend-dot" style="background-color: #a333c8;"></span> Doping Allegations');

  });
});