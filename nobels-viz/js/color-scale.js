function display_colors(data) {
  console.log(data);

  let svg_colors = d3.select('#color-scale')
    .append('svg')
      .attr('width', 2100)
      .attr('height', 300)
    .append('g');
  
  data.forEach((country, i) => {
    let color = svg_colors.append('g')
    .attr('class', 'country ' + country.country);

    color.append('rect')
      .attr('x', i * 20)
      .attr('y', 0)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', d => { 
        return getColorFill(country.country);
       });

    color.append('text')
      .text(d => { return country.country + ', ' + country.continent; })
      // .attr('x', i * 20 + 12)
      // .attr('y', 25);
      .attr('transform', 'translate(' + (i * 20 + 5) + ',' + '25)rotate(90)');

  });
  
}
