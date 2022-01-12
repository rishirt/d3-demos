function generateNobelsPerCountry(angleCategory) {
  // set the dimensions of the graph
  const innerRadius_country = 465;
  const outerRadius_country = 900;
  
  const max_bars = 52; // Maximal number of bars per category
  let width_bars = degreeToRadian((angleCategory - 4*anglePadding) / max_bars);  // Width of a bar (in radians)
  
  // Append the svg object
  let svg_nobel_country = d3.select('#nobel-per-country')
    .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', window.innerWidth)
      .attr('class', 'nobelscountry')
    .append('g')
      .attr("transform", "translate(" + (window.innerWidth/2) + "," + (window.innerWidth/2) + ")");
  
  categories.forEach(category => {
    // Load data - sex distribution per category
    d3.csv('/data/nobel_country-per_category_' + category + '.csv').then(data => {
      nobel_per_country(data, category, angleCategory, innerRadius_country, outerRadius_country, width_bars, svg_nobel_country);
    }).catch(error => {
      console.log(error);
    });
  });
}

// Display data - nobel per country
function nobel_per_country(data, category, angleCategory, innerRadius_country, outerRadius_country, width_bars, svg_nobel_country) {
  const max_country = 120;
  padAngle = 0.0017;
  const j = categories.indexOf(category);

  // Scales
  const startAngle = degreeToRadian(angleCategory/2 + j*angleCategory + anglePadding);
  let x_scale_country = d3.scaleBand()
    .domain(data.map(d => { return d.country }))
    .range([startAngle, startAngle + (data.length + 1) * (width_bars + 2*padAngle)]);
  let y_scale_country = d3.scaleLinear()
    .domain([0, max_country])
    .range([innerRadius_country, outerRadius_country]);

  // Add the bars
  svg_nobel_country.append('g')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
      .attr('class', d => { return 'country-bar country-bar--' + category + '--' + d.country_id; })
      .attr("fill", d => {
        if (d.country === 'International Organizations') {
          return '#FCD20A';
        } else {
          return getColorFill(d.country);
        }
      })
      .attr('d', d3.arc()
        .innerRadius(innerRadius_country)
        .outerRadius(d => { return y_scale_country(d.count); })
        .startAngle(d => { return x_scale_country(d.country); })
        .endAngle(d => { return x_scale_country(d.country) + width_bars; })
        // .padAngle(padAngle)
        // .padRadius(innerRadius_country)
      );


  // Add the labels
  // svg_nobel_country.append("g")
  //   .selectAll("g")
  //   .data(data)
  //   .enter()
  //   .append("g")
  //     .attr('text-anchor', 'start')
  //     .attr('text-anchor', (d) => {
  //       let anchor = '';
  //       j < categories.length/2 ? anchor = 'start' : anchor = 'end';
  //       return anchor;
  //     })
  //     .attr("transform", d => { return "rotate(" + ((x_scale_country(d.country) + width_bars / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (outerRadius_country + 110) + ",0)"; })
  //   .append("text")
  //     .text(d => { return d.country })
  //     .attr("transform", d => { return (x_scale_country(d.country) + width_bars / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
  //     .style("font-size", "8px")
  //     .attr("alignment-baseline", "middle");

}
