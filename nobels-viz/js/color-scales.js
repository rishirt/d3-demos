// Color scales (cs)
let cs_africa = d3.scaleLinear().domain([0, 5]).range(['#CFD3B2', '#626D00']);
let cs_asia = d3.scaleLinear().domain([0, 23]).range(['#C0D0DF', '#2E6395']);
let cs_australia = d3.scaleLinear().domain([0, 7]).range(['#CFC0B8', '#5F2D13']);
let cs_europe = d3.scaleLinear().domain([0, 108]).range(['#DCD0DE', '#8B6594']);
let cs_north_america = d3.scaleLinear().domain([0, 416]).range(['#E1BFC0', '#9E2C30']);
let cs_south_america = d3.scaleLinear().domain([0, 4]).range(['#F8D3C1', '#E96F32']);

function getColorFill(d) {
  let countryCount = data_country_count.find(country => country.country === d);
  let color = '';

  switch (countryCount.continent) {
    case 'Africa':
      color = cs_africa(countryCount.nobel_count);
      break;
    case 'Asia':
      color = cs_asia(countryCount.nobel_count);
      break;
    case 'Australia':
      color = cs_australia(countryCount.nobel_count);
      break;
    case 'Europe':
      color = cs_europe(countryCount.nobel_count);
      break;
    case 'North America':
      color = cs_north_america(countryCount.nobel_count);
      break;
    case 'South America':
      color = cs_south_america(countryCount.nobel_count);
      break;
  }

  return color;
}

