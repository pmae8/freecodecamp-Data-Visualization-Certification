const countyURL =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const w = 960;
const h = 600;

const path = d3.geoPath();

const svg = d3.
select("#container").
append("svg").
attr("width", w).
attr("height", h);

const tooltip = d3.
select("#container").
append("div").
attr("id", "tooltip").
style("opacity", 0);

// Color scale
const color = d3.
scaleThreshold().
domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8)).
range(d3.schemeGreens[9]);

// Legend
const x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

const legend = svg.
append("g").
attr("id", "legend").
attr("transform", "translate(0,40)");

legend.
selectAll("rect").
data(
color.range().map(function (d) {
  d = color.invertExtent(d);
  if (d[0] == null) d[0] = x.domain()[0];
  if (d[1] == null) d[1] = x.domain()[1];
  return d;
})).

enter().
append("rect").
attr("height", 8).
attr("x", function (d) {
  return x(d[0]);
}).
attr("width", function (d) {
  return x(d[1]) - x(d[0]);
}).
attr("fill", function (d) {
  return color(d[0]);
});

legend.
append("text").
attr("x", x.range()[0]).
attr("y", -6).
attr("fill", "#000").
attr("text-anchor", "end").
attr("font-weight", "bold").
text("Percentage");

legend.
call(
d3.
axisBottom(x).
tickSize(13).
tickFormat(function (x) {
  return Math.round(x) + "%";
}).
tickValues(color.domain())).

select(".domain").
remove();

// Fetch data and create the map
Promise.all([d3.json(countyURL), d3.json(educationURL)]).
then(([countyData, educationData]) => {
  console.log("County Data:", countyData); // Log countyData
  console.log("Education Data:", educationData); // Log educationData

  const educationById = {};

  educationData.forEach(d => {
    educationById[d.fips] = d.bachelorsOrHigher;
  });

  svg.
  append("g").
  selectAll("path").
  data(topojson.feature(countyData, countyData.objects.counties).features).
  enter().
  append("path").
  attr("class", "county").
  attr("data-fips", d => d.id).
  attr("data-education", d => educationById[d.id]).
  attr("fill", d => color(educationById[d.id])).
  attr("d", path).
  on("mouseover", (event, d) => {
    console.log("County ID:", d.id);
    const county = countyData.objects.counties.geometries.find(
    obj => obj.id === d.id);

    console.log("County object:", county);
    if (county) {
      tooltip.
      style("opacity", 0.9).
      attr("data-education", educationById[d.id]).
      html(
      () =>
      `${county.properties.name}, ${
      educationData.find(obj => obj.fips === d.id).state
      }: ${educationById[d.id]}%`).

      style("left", event.pageX + 10 + "px").
      style("top", event.pageY - 28 + "px");
    }
  }).
  on("mouseout", () => {
    tooltip.style("opacity", 0);
  });
}).
catch(error => {
  console.error("Error loading or parsing data:", error);
});