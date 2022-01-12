// Radar Chart options
const radarChartOptions = {
  width: 600,
  height: 600,
  innerDiameter: 550,
  margin: {top: 100, right: 100, bottom: 100, left: 100},
  maxValue: 250,
  levels: 5,
  roundStrokes: true,
  color: d3.scaleOrdinal(["#03658C","#F26D78"]),
};

radarChart("#sex-per-category", dataPerAxis, radarChartOptions, 2019);

function radarChart(selector, data, options) {
  // Default configuration
  var cfg = {
    width: 600, //Width of the circle
    height: 600, //Height of the circle
    innerDiameter: 400,
    margin: {top: 20, right: 20, bottom: 20, left: 20}, //Margins of the SVG element
    levels: 3, //How many levels of inner circles should be drawn
    maxValue: 1, //Value that the biggest circle will represent
    labelFactor: 1.25, //How much further for the outer circle the labels should be positioned
    wrapWidth: 150, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.25, //Opacity of the area of the blob
    dotRadius: 4, //Size of the circles representing each value
    opacityCircles: 0, //Opacity of the circles representing each value
    strokeWidth: 2, //Width of the stroke around each blob
    roundStrokes: false, //If true, teh area and stroke of the blobs will follow a round path (cardinal-closed interpolation)
    color: d3.scaleOrdinal(d3.schemeCategory10), //Color function
  };

  // Populate cfg with options
  if (typeof options !== 'undefined') {
    for (var i in options) {
      if (typeof options[i] !== 'undefined') {
        cfg[i] = options[i];
      }
    }
  }

  // Base variables
  var allAxis = (data.axisLabels.map(function(i) { //Get the label of each axis
    return i.label;
  }));
  var numberOfAxis = allAxis.length; //Get the number of axis
  var angleSlice = Math.PI * 2 / numberOfAxis; //Width of each slice (in radians)
  var outerRadius = Math.min(cfg.width / 2, cfg.height / 2); //Radius of the outermost circle
  var innerRadius = cfg.innerDiameter / 2;

  // Scale for the radius
  var rScale = d3.scaleLinear()
    .domain([0, cfg.maxValue])
    .range([innerRadius, outerRadius]);

  /////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
  /////////////////////////////////////////////////////////
  
  // Remove whaterver chart with the same id/class was present before
  d3.select(selector).select('svg').remove();

  // Initiate the radar chart SVG
  var svg = d3.select(selector).append('svg')
    .attr('width', cfg.width + cfg.margin.left + cfg.margin.right)
    .attr('height', cfg.height + cfg.margin.top + cfg.margin.bottom)
    .attr('class', 'radar-' + selector);
  
  // Append a g element
  var g = svg.append('g')
    .attr('transform', 'translate(' + (cfg.width/2 + cfg.margin.left) + ',' + (cfg.height/2 + cfg.margin.top) + ')');
  

  /////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////
  
  // Wrapper for the grid & axes
  var axisGrid = g.append('g').attr('class', 'axisWrapper');

  // Draw the background circles
  axisGrid.selectAll('.grid-circle')
    .data(d3.range(0,(cfg.levels + 1)))
    .enter()
    .append('circle')
    .attr('class', 'grid-circle')
    .attr('r', function(d) {
      return ((outerRadius - innerRadius) / cfg.levels * d) + innerRadius;
    })
    .style('stroke', '#CDCDCD')
    .style('fill-opacity', cfg.opacityCircles)
    .style('stroke-opacity', (d, i) => {
      if (i === 0) {
        return 1;
      } else {
        return 0;
      }
    });

  // Add labels to the circles
  // axisGrid.selectAll('.axisLabel')
  //   .data(d3.range(1, cfg.levels + 1))
  //   .enter()
  //   .append('text')
  //   .attr('class', 'axisLabel')
  //   .attr('x', 4)
  //   .attr('y', function(d) {
  //     return -1 * ((d * (outerRadius - innerRadius) / cfg.levels) + innerRadius);
  //   })
  //   .attr('dy', '0.4rem')
  //   .style('font-size', '10px')
  //   .attr('fill', '#737373')
  //   .text(function(d) {
  //     return cfg.maxValue * d / cfg.levels;
  //   });

  /////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////
  
  // Draw the axes (lines radiating from the center)
  var axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .enter()
    .append('g')
    .attr('class', 'axis');

  // Append the lines to the groups
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', function(d, i) {
      return rScale(outerRadius * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('y2', function(d, i) {
      return rScale(outerRadius * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr('class', 'line')
    .style('stroke', '#ccc')
    .style('stroke-width', '2px');
  
  // Add labels to the axis
  axis.append('text')
    .attr('class', 'legend')
    .style('font-size', '12px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35rem')
    .attr('x', function (d,i) {
      return rScale(cfg.maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('y', function (d,i) {
      return rScale(cfg.maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .text(function(d) {
      return d;
    });

  /////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////
  
  // Radial line function
  var radarLine = d3.lineRadial()
    .curve(d3.curveBasicClosed)
    .radius(function(d) {
      return rScale(d.value);
    })
    .angle(function(d, i) {
      return i * angleSlice;
    });
  
  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinalClosed);
  }

  // Create a wrapper for the blobs
  var blobWrapper = g.selectAll('.radarWrapper')
    .data(data.dataPerSex)
    .enter()
    .append('g')
    .attr('class', 'radarWrapper');

  // Append the backgrounds
  // blobWrapper.append('path')
  //   .attr('class', 'radarArea')
  //   .attr('d', function(d) {
  //     return radarLine(d);
  //   })
  //   .style('fill', function(d, i) {
  //     return cfg.color(i);
  //   })
  //   .style('fill-opacity', cfg.opacityArea);

  // Create the outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', function(d) {
      return radarLine(d);
    })
    .style('stroke-width', cfg.strokeWidth + 'px')
    .style('stroke', function(d, i) {
      return cfg.color(i);
    })
    .style('fill', 'none');
}