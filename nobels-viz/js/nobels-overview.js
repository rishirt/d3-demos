const marginsOverview = { top: 100, right: 100, bottom: 100, left: 100 };
const widthOverview = 1540;
const heightOverview = 1170;
let outerRadius = widthOverview/2;
const innerRadius = 100;
const yearHeight = 4; // Height of a year on the disk (in pixels)
const radialSpacing = 1; // Radial space between years (in pixels)
const yearMin = 1901;
let yearMax = 2019;
let yearsSpan = 100; // Difference between the latest and the first year (will be calculated once data is fetched)
const anglePadding = 5; // Padding between categories (in degrees)
let years = [];
for (let i = yearMin; i <= yearMax; i++) {
  years.push(i);
}
const highlightedYears = [1920, 1940, 1960, 1980, 2000];


getOuterRadius(data_nobel_overview);
generateOverview(data_nobel_overview, categories, dataYearSex, dataCategorySex);

function getOuterRadius(data) {
  yearMax = d3.max(data, d => parseInt(d.year));
  yearsSpan = yearMax - yearMin;
  outerRadius = yearsSpan * yearHeight + innerRadius;
}

function generateOverview(data, categories, dataYearSex, dataCategorySex) {
  const angleCategory = 360 / (categories.length + 1); // Angle occupied by each category (in degrees)

  //
  // Append the svg object
  //
  let svgOverview = d3.select('#nobel-overview')
    .append('svg')
      .attr('width', widthOverview)
      .attr('height', heightOverview)
    .append('g')
      .attr('class', 'overview--wrapper')
      .style('transform', 'translate(50%, 50%)');

  // Add defs
  let defs = svgOverview.append('defs');
  
  // Generate arcs
  let arcGenerator = d3.arc()
    .cornerRadius(10)
    .padAngle(0.004);
  let arcGeneratorBg = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius + yearHeight);

  
  //
  // Append background paths
  //

  // Create radial gradient for men
  defs.append('radialGradient')
		.attr('id', 'men-gradient')
		.attr('gradientUnits', 'userSpaceOnUse')
		.attr('cx', 0)
		.attr('cy', 0)
		.selectAll('stop')
		.data([
				{offset: '10%', color: 'white'},
				{offset: '100%', color: '#E1F2F2'}
			])
		.enter().append('stop')
		.attr('offset', function(d) { return d.offset; })
    .attr('stop-color', function(d) { return d.color; });
    
  // Create radial gradient for women
  defs.append('radialGradient')
    .attr('id', 'women-gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('cx', 0)
    .attr('cy', 0)
    .selectAll('stop')
    .data([
        {offset: '10%', color: 'white'},
        {offset: '100%', color: '#F9E7E5'}
      ])
    .enter().append('stop')
    .attr('offset', function(d) { return d.offset; })
    .attr('stop-color', function(d) { return d.color; });
  
  // Append background paths for each category
  appendBg('men');
  appendBg('women');
  
  function appendBg(sex) {
    let sign;
    sex === 'men' ? sign = -1 : sign = 1;

    let categoryWrappers = svgOverview.append('g')
      .attr('class', 'category-wrappers-container--' + sex);
  
    categories.forEach((category, i) => {
      categoryWrappers.append('g')
        .attr('class', 'category-wrapper category-wrapper--' + category)
        .append('path')
          .attr('class', 'category-bg category-bg--' + sex)
          .style('fill', d => { return 'url(#' + sex + '-gradient)'; })
          .attr('d', arcGeneratorBg({
            startAngle: degreeToRadian(i*angleCategory + angleCategory),
            endAngle: sign * degreeToRadian((angleCategory/2 - anglePadding)) + degreeToRadian((i + 1) * angleCategory),
          }));
    });
  }


  //
  // Append axis and labels
  //
  
  // Append an axis for each category
  let categoryAxes = svgOverview.append('g')
    .attr('class', 'category-axes');
  categoryAxes.selectAll('.category-axis')
    .data(categories)
    .enter()
    .append('line')
    .attr('class', 'category-axis')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d, i) => {
      return outerRadius * Math.sin(degreeToRadian(((i + 1) * angleCategory + angleCategory/2)));
    })
    .attr('y2', (d, i) => {
      return outerRadius * Math.cos(degreeToRadian(((i + 1) * angleCategory + angleCategory/2)));
    })
    .style('stroke', '#fff')
    .style('stroke-width', '2px');

  // Append the name of each category
  let arcCategories = d3.arc()
    .innerRadius(outerRadius + 30)
    .outerRadius(outerRadius + 31);
  let categoryLabels = svgOverview.append('g')
    .attr('class', 'category-labels');
  categoryLabels.selectAll('.category-label')
    .data(categories)
    .enter()
    .append('path')
    .attr('id', d => {
      return 'category-label--' + d;
    })
    .attr('d', (d, i) => {
      let startAngle = degreeToRadian((angleCategory / 2) + (i * angleCategory) + anglePadding);
      let endAngle = degreeToRadian((3 * angleCategory / 2) + (i * angleCategory) - anglePadding);
      if (endAngle > degreeToRadian(90) && endAngle < degreeToRadian(270)) {
        // If the end angle is between 90 and 270 degrees, flip the path (this will reverse the text)
        return arcCategories({
          startAngle: endAngle,
          endAngle: startAngle
        });
      } else {
        return arcCategories({
          startAngle: startAngle,
          endAngle: endAngle
        });
      }
    })
    .attr('fill', 'none');
  categories.forEach(category => {
    categoryLabels.append('text')
      .attr('class', 'category-label')
      .style('text-anchor', 'middle')
      .attr('dy', 8 + 'px') // Center the text on the path (radially)
      .append('textPath')
      .attr('xlink:href', '#category-label--' + category)
      .attr('startOffset', '25%') // Center the text on the path (circumferentially)
      .text(category);
  });

  // Append circle axes
  let circlesArc = d3.arc()
    .startAngle(0)
    .endAngle(2 * Math.PI);
  const circleAxisPoints = [1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010];
  let axisCircles = svgOverview.append('g')
    .attr('class', 'overview-circular-axes');
  axisCircles.selectAll('.overview-circular-axis')
    .data(dataYearSex)
    .enter()
    .append('path')
      .attr('class', d => {
        let visibilityClass = '';
        if (circleAxisPoints.indexOf(parseInt(d.year)) !== -1 || (d.num_male === '0' && d.num_female === '0')) {
          visibilityClass = 'markerYear';
        }
        return `overview-circular-axis overview-circular-axis-${d.year} ${visibilityClass}`;
      })
      .attr('d', d => {
        let axisWidth = 2;
        if (circleAxisPoints.indexOf(parseInt(d.year)) !== -1 || (d.num_male === '0' && d.num_female === '0')) {
          axisWidth = radialSpacing;
        }
        return circlesArc({
          innerRadius: ((d.year - yearMin) * yearHeight) + innerRadius - 1,
          outerRadius: ((d.year - yearMin) * yearHeight) + innerRadius + (yearHeight - axisWidth) + 1
        });
      })
      .on('mouseenter', d => {
        d3.select(`.overview-circular-axis-${d.year}`)
          .classed('highlighted', true);
        d3.select(`.tick-label-${d.year}`)
          .classed('highlighted', true);
      })
      .on('mouseleave', d => {
        d3.select(`.overview-circular-axis-${d.year}`)
          .classed('highlighted', false)
        d3.select(`.tick-label-${d.year}`)
          .classed('highlighted', false);
      });

  // Append year labels
  // axisCircles.selectAll('.overview-year-label')
  //     .data(dataYearSex)
  //     .enter()
  //     .append('text')
  //       .attr('class', 'overview-year-label')
  //       .attr('text-anchor', 'start')
  //       .attr('y', d => {
  //         return -1 * (((d.year - yearMin) * yearHeight) + innerRadius - 4);
  //       })
  //       .text(d => { return d.year; })
  //       .attr('fill-opacity', d => {
  //         if (circleAxisPoints.indexOf(parseInt(d.year)) !== -1) {
  //           return 1;
  //         } else {
  //           return 0;
  //         }
  //       });

  //
  // Helper functions for the nobel arcs
  //

  // Get the country
  function getCountry(d) {
    let country;
    if (d.laureate_type === 'Organization') {
      if (d.organization_country === '') {
        country = 'International Organization';
      } else {
        country = d.organization_country;
      }
    } else if (d.organization_country === '') {
      country = d.birth_country;
    } else {
      country = d.organization_country;
    }
    return country;
  }

  // Get the color based on the country
  function getColor(country, laureate_type) {
    if (laureate_type === 'Organization') {
      return '#FCD20A';
    } else {
      return getColorFill(country);
    }
  }

  // Tooltip show/hide
  function showTooltip(d, country) {
    // Find location of the mouse on the page
    const xpos = d3.event.pageX - 15;
    const ypos = d3.event.pageY - 15;

    // Prepare organization and location strings
    let organization;
    d.organization_name !== '' ? organization = d.organization_name + ', ' : organization = '';
    let organization_city;
    d.organization_city !== '' ? organization_city = d.organization_city + ', ' : organization_city = '';

    // Add text to the existing tooltip markup
    d3.select('#nobel-tooltip .nt-category').text(d.category + ' - ' + d.year);
    d3.select('#nobel-tooltip .nt-name').text(d.name);
    d3.select('#nobel-tooltip .nt-location').text(organization + organization_city + country);
    if (d.motivation !== '') {
      d3.select('#nobel-tooltip .nt-quote').text(d.motivation.substr(1).slice(0, -1));
      d3.select('#nobel-tooltip .nt-quote').append('span')
        .attr('class', 'quote-icon quote-icon--left');
      d3.select('#nobel-tooltip .nt-quote').append('span')
        .attr('class', 'quote-icon quote-icon--right');
    } else {
      d3.select('#nobel-tooltip .nt-quote').text('');
    }
    d3.select('#nobel-tooltip .nt-share').text('share: ' + d.prize_share);

    // Make the tooltip appear at the right location
    d3.select('#nobel-tooltip')
      .style('top', ypos + 'px')
      .style('left', xpos + 'px')
      .transition()
      .duration(0)
      .style('opacity', 1);
  }
  function hideTooltip() {
    d3.select('#nobel-tooltip')
      .transition()
      .duration(100)
      .style('opacity', 0);
  }

  //
  // Append the donuts showing the overall data
  //

  let categoryIndexPrevious = '';
  let currentYear = '1901';
  let yearChange = false;
  let arc_male = 0;
  let arc_female = 0;
  let startAngle;
  let endAngle;
  let mixedTypeCase = false;
  let organizationCount = 0;
  svgOverview.append('g')
    .attr('class', 'nobel-wrappers-container')
    .selectAll('nobel-wrapper')
    .data(data)
    .enter()
    .append('g')
      .attr('class', 'nobel-wrapper')
    .append('path')
      .attr('class', d => {
        return 'nobel-arc nobel-arc--' + d.sex.toLowerCase();
      })
      .attr('d', d => {
        let categoryIndex = categories.indexOf(d.category.toLowerCase());
        if (d.year !== currentYear) {
          currentYear = d.year;
          yearChange = true;
        }
        // If changing category or year, reset arcs
        if (categoryIndex !== categoryIndexPrevious || yearChange) {
          arc_male = 0;
          arc_female = 0
          mixedTypeCase = false;
          organizationCount = 0;
        }
        let sign;
        let previousArc = '';
        if (d.sex === 'Male') {
          sign = -1;
          previousArc = arc_male;
        } else {
          sign = 1;
          previousArc = arc_female;
        }
        let share = d.prize_share.charAt(0);
        let share_total = d.prize_share.charAt(2);

        const nobelArc = degreeToRadian(share/share_total * (angleCategory/2 - anglePadding));
        if (d.laureate_type === 'Organization' && d.sex === '') {
          // If the laureate is an organization, center the path in the middle of the category
          if (d.year === '1947' || d.year === '1963') {
            // Take edge cases into account
            startAngle = degreeToRadian((categoryIndex + 1) * angleCategory) - nobelArc + organizationCount * nobelArc;
            organizationCount += 1;
          } else {
            startAngle = degreeToRadian((categoryIndex + 1) * angleCategory) - nobelArc/2;
          }
          endAngle = startAngle + nobelArc;
          arc_male += -1 * nobelArc/2;
          arc_female += nobelArc/2;
          mixedTypeCase = true;
        } else {
          // If the laureate is an individual, position the path either on the male of the female section
          startAngle = degreeToRadian((categoryIndex + 1) * angleCategory) + previousArc;
          if (mixedTypeCase) {
            endAngle = startAngle + sign * nobelArc/2;
          } else {
            endAngle = startAngle + sign * nobelArc;
          }
          d.sex === 'Male' ? arc_male += sign * nobelArc : arc_female += sign * nobelArc;
        }

        categoryIndexPrevious = categoryIndex;
        yearChange = false;
        
        return arcGenerator({
          startAngle: startAngle,
          endAngle: endAngle,
          innerRadius: ((d.year - yearMin) * yearHeight) + innerRadius,
          outerRadius: ((d.year - yearMin) * yearHeight) + innerRadius + (yearHeight - radialSpacing),
        });
      })
      .attr('fill', d => {
        let country = getCountry(d);
        return getColor(country, d.laureate_type);
      })
      .attr('stroke', d => {
        let country = getCountry(d);
        return getColor(country, d.laureate_type);
      })
      .on('mouseover', d => {
        d3.event.stopPropagation();
        // Show the tooltip
        showTooltip(d, getCountry(d));
      })
      .on('mouseout', d => {
        // Hide the tooltip
        hideTooltip();
      });

  // Append center text
  svgOverview
    .append('g')
      .attr('class', 'overview-title')
      .attr('x', widthOverview/2)
      .attr('y', widthOverview/2)
      .style('transform', 'translate(0, -16px)')
      .append('text')
        .text('THE');
  svgOverview.select('.overview-title')
      .append('text')
        .text('NOBEL')
        .attr('y', 23 + 'px');
  svgOverview.select('.overview-title')
      .append('text')
        .text('PRIZE')
        .attr('y', 47 + 'px');
}

// Call the function to generate the sex-per-year graph
generateSexPerYear(dataYearSex, innerRadius, outerRadius);

// Helper function - convert degress to radians
function degreeToRadian(angle) {
  return angle * Math.PI / 180;
}