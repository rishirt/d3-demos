function generateSexPerCategory(dataCategorySex, outerRadius, angleCategory) {
  const radialMargin = 70;

  // Radial scale
  let r_scale = d3.scaleLinear()
    .domain([0, d3.max(dataCategorySex, d => d.sum_men)])
    .range([outerRadius + radialMargin, outerRadius + 150 + radialMargin]);

  // Generate radial lines
  const radialLineGenerator = d3.lineRadial()
    // .curve(d3.curveNatural);
    .curve(d3.curveCatmullRom.alpha(1));

  // Data points for men and women
  const dataPoints = [];
  // const dataPointsMen = [];
  // const dataPointsWomen = [];
  dataCategorySex.forEach((category, i) => {
    dataPoints.push([
      [degreeToRadian(angleCategory/2 + i * angleCategory + anglePadding), outerRadius + radialMargin],
      [degreeToRadian(angleCategory/2 + i * angleCategory + angleCategory/16 + anglePadding), outerRadius + radialMargin],
      [degreeToRadian(angleCategory/2 + i * angleCategory + angleCategory/4 + anglePadding/2), r_scale(category.sum_men)],
      [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - angleCategory/2 - angleCategory/16), outerRadius + radialMargin],
      [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - angleCategory/2), outerRadius + radialMargin],
      [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - (angleCategory/2 - angleCategory/16)), outerRadius + radialMargin],
      [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - angleCategory/4 - anglePadding/2), r_scale(category.sum_women)],
      [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - anglePadding - angleCategory/16), outerRadius + radialMargin],
      [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - anglePadding), outerRadius + radialMargin]
    ])
    // dataPointsMen.push([
    //   [degreeToRadian(angleCategory/2 + i * angleCategory + anglePadding), outerRadius + radialMargin],
    //   [degreeToRadian(angleCategory/2 + i * angleCategory + angleCategory/16 + anglePadding), outerRadius + radialMargin],
    //   [degreeToRadian(angleCategory/2 + i * angleCategory + angleCategory/4 + anglePadding/2), r_scale(category.sum_men)],
    //   [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - angleCategory/2 - angleCategory/16), outerRadius + radialMargin],
    //   [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - angleCategory/2), outerRadius + radialMargin]
    // ]);
    // dataPointsWomen.push([
    //   [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - angleCategory/2), outerRadius + radialMargin],
    //   [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - (angleCategory/2 - angleCategory/16)), outerRadius + radialMargin],
    //   [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - angleCategory/4 - anglePadding/2), r_scale(category.sum_women)],
    //   [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - anglePadding - angleCategory/16), outerRadius + radialMargin],
    //   [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - anglePadding), outerRadius + radialMargin]
    // ]);
    // dataPointsMen.push(generatePoints(category, i, 'men'));
    // dataPointsWomen.push(generatePoints(category, i, 'women'));
  });
  // function generatePoints(category, i, sex) {
  //   return [
  //     [degreeToRadian(angleCategory/2 + i * angleCategory + anglePadding), outerRadius],
  //     [degreeToRadian((i + 1) * angleCategory), r_scale(category['sum_' + sex])],
  //     [degreeToRadian(angleCategory/2 + (i + 1) * angleCategory - anglePadding), outerRadius]
  //   ];
  // }
  
  // Append svg to page
  const diameterCategorySex = (outerRadius + r_scale(d3.max(dataCategorySex, d => d.sum_men))) * 2;
  let svg_sex_category = d3.select('#sex-per-category')
    .append('svg')
      .attr('width', diameterCategorySex)
      .attr('height', diameterCategorySex)
      .attr('class', 'catsex')
    .append('g')
      .attr('class', 'catsex-container');

  // Add defs
  let defs = svg_sex_category.append('defs');
  
  // Create linear gradient for men
  let linearGradientCategory = defs.append('linearGradient')
    .attr('id', 'gradient-sexpercat');
  // linearGradientCategory.append('stop')
  //   .attr('offset', '0%')
  //   .style('stop-color', '#68BDBF')
  //   .style('stop-opacity', 1);
  linearGradientCategory.append('stop')
    .attr('offset', '0%')
    .style('stop-color', '#68BDBF')
    .style('stop-opacity', 1);
  linearGradientCategory.append('stop')
    .attr('offset', '100%')
    .style('stop-color', '#E0867B')
    .style('stop-opacity', 1);
  // linearGradientCategory.append('stop')
  //   .attr('offset', '100%')
  //   .style('stop-color', '#E0867B')
  //   .style('stop-opacity', 1);

  // // Append men's line
  // let pathsMen = svg_sex_category.append('g')
  //   .attr('class', 'lines-men');
  // categories.forEach((category, i) => {
  //   pathsMen.append('path')
  //     .attr('class', 'line line-male')
  //     .attr('d', radialLineGenerator(dataPointsMen[i]));
  // });

  // // Append women's line
  // let pathsWomen = svg_sex_category.append('g')
  //   .attr('class', 'lines-women');
  // categories.forEach((category, i) => {
  //   pathsWomen.append('path')
  //     .attr('class', 'line line-female')
  //     .attr('d', radialLineGenerator(dataPointsWomen[i]));
  // });

  let path = svg_sex_category.append('g')
    .attr('class', 'lines-sexpercat');
  categories.forEach((category, i) => {
    path.append('path')
      .attr('class', 'line')
      .attr('d', radialLineGenerator(dataPoints[i]));
  });

}
