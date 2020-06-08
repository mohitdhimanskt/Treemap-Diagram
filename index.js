const DATASETS = {
    videogames: {
      TITLE: "Video Game Sales",
      DESCRIPTION: "Top 100 Most Sold Video Games Grouped by Platform",
      FILE_PATH: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json" },
  
    movies: {
      TITLE: "Movie Sales",
      DESCRIPTION: "Top 100 Highest Grossing Movies Grouped By Genre",
      FILE_PATH: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json" },
  
    kickstarter: {
      TITLE: "Kickstarter Pledges",
      DESCRIPTION: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
      FILE_PATH: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json" } };
  

      var urlParams = new URLSearchParams(window.location.search);
      const DEFAULT_DATASET = "videogames";
      const DATASET = DATASETS[urlParams.get('data') || DEFAULT_DATASET];
      //const dataSelector = document.getElementById("data-selector");
      
      //dataSelector.innerHTML = '<a>' + DATASETS[0].TITLE + '</a>' + '/' + '<a>' + DATASETS[1].TITLE + '</a>' + '/' + '<a>' + DATASETS[2].TITLE + '</a>';
      
      document.getElementById("title").innerHTML = DATASET.TITLE;
      document.getElementById("description").innerHTML = DATASET.DESCRIPTION;
      var body = d3.select("body");

      var tooltip = body.append("div").
      attr("class", "tooltip").
      attr("id", "tooltip").
      style("opacity", 0);
      
      var svg = d3.select("#tree-map"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
      
      var fader = function (color) {return d3.interpolateRgb(color, "#fff")(0.2);},
      color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
      format = d3.format(",d");

      var treemap = d3.treemap().
size([width, height]).
paddingInner(1);

d3.json(DATASET.FILE_PATH, function (error, data) {

  if (error) throw error;

  var root = d3.hierarchy(data).
  eachBefore(function (d) {
    d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
  }).
  sum(sumBySize).
  sort(function (a, b) {return b.height - a.height || b.value - a.value;});

  treemap(root);