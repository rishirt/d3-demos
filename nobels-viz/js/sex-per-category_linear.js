const margin_sex_cat = {top: 50, right: 50, bottom: 50, left: 50};
const width_sex_cat = 1000; 
const height_sex_cat = 100;

// Load data - sex distribution per category
d3.csv('/data/data_per-category_per-sex.csv').then(data => {
  sex_per_category(data);
}).catch(error => {
  console.log(error);
});

// Display data - sex distribution per category
function sex_per_category(data) {
  console.log(data);
  const indexes = [];
  const categories = [];
  const males = [];
  const females = [];
  data.forEach(item => {
    indexes.push(parseInt(item.index));
    categories.push(item.category);
    males.push(parseInt(item.sum_male));
    females.push(parseInt(item.sum_female));
  });

  // X scales
  let x_scale_sex_cat_band = d3.scaleBand()
    .domain(categories)
    .rangeRound([0, width_sex_cat])
    .padding(0);
  let x_scale_sex_cat_linear = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.index)])
    .range([0, width_sex_cat]);

  // Y scale
  let y_scale_sex_cat = d3.scaleLinear()
    .domain([0, Math.max(d3.max(males), d3.max(females))])
    .range([height_sex_cat, 0]);

  // Generate lines
  let line_male_sex_cat = d3.line()
    .x((d, i) => { return x_scale_sex_cat_linear(i); })
    .y(d => { return y_scale_sex_cat(d.sum_male); })
    .curve(d3.curveMonotoneX);
  let line_female_sex_cat = d3.line()
    .x((d, i) => { return x_scale_sex_cat_linear(i); })
    .y(d => { return y_scale_sex_cat(d.sum_female); })
    .curve(d3.curveMonotoneX);

  // Append svg to the page
  let svg_sex_cat = d3.select('#sex-per-category')
    .append('svg')
      .attr('width', width_sex_cat + margin_sex_cat.top + margin_sex_cat.bottom)
      .attr('height', height_sex_cat + margin_sex_cat.left + margin_sex_cat.right)
    .append('g')
      .attr('class', 'sex-per-category--group');

  // Call x axis
  svg_sex_cat.append('g')
    .attr('class', 'axis axis-x axis-categories')
    .attr('transform', 'translate(' + (width_sex_cat/14 * -1) + ',' + height_sex_cat + ')')
    .call(d3.axisBottom(x_scale_sex_cat_band));
  // svg_sex_cat.append('g')
  //   .attr('class', 'axis axis-x')
  //   .attr('transform', 'translate(0,' + height_sex_cat + ')')
  //   .call(d3.axisBottom(x_scale_sex_cat_linear));

  // Append path, bind data and call line generator for Males
  svg_sex_cat.append('path')
    .datum(data)
    .attr('class', 'line line-male')
    .attr('d', line_male_sex_cat);
  svg_sex_cat.append('path')
    .datum(data)
    .attr('class', 'line line-female')
    .attr('d', line_female_sex_cat);
}
