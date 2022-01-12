function sortAccessor(d) {
    var value = d[state.selectedIndicator];
    if(value === null) value = 0;
    return value;
}

function getSortedData(data) {
    var sorted;

    if(state.selectedIndicator === 'country') {
        sorted = _.orderBy(data, 'name');
    } else {
        sorted = _.orderBy(data, sortAccessor, 'desc');
    }

    return sorted;
}

function isVisible(d) {
    return state.selectedIndicator === 'country' || d[state.selectedIndicator] > 0;
}

function getTruncatedLabel(text) {
    return text.length < 10 ? text : text.slice(0, 9) + '...';
}

function getMaxRadius() {
    var cellWidth = config.width / config.numColumns;
    var maxRadius = 0.35 * cellWidth;
    return maxRadius;
}

function layout(data) {
    var labelHeight = 20;
    var cellWidth = config.width / config.numColumns;
    var cellHeight = cellWidth + labelHeight;

    var maxRadius = getMaxRadius();

    var radiusScale = d3.scaleSqrt()
        .domain([0, 100])
        .range([0, maxRadius]);

    var sortedData = getSortedData(data);

    var layoutData = sortedData.map(function(d, i) {
        var item = {};

        item.id = d.id;

        var column = i % config.numColumns;
        var row = Math.floor(i / config.numColumns);

        item.x = column * cellWidth + 0.5 * cellWidth;
        item.y = row * cellHeight + 0.5 * cellHeight;

        item.visible = isVisible(d);

        item.renewableRadius = radiusScale(d.renewable);
        item.oilGasCoalRadius = radiusScale(d.oilgascoal);
        item.hydroelectricRadius = radiusScale(d.hydroelectric);
        item.nuclearRadius = radiusScale(d.nuclear);

        item.labelText = getTruncatedLabel(d.name);
        item.labelOffset = maxRadius + labelHeight;

        item.popupOffset = -0.5 * maxRadius;
        item.popupData = {
            name: d.name,
            renewable: d.renewable,
            oilgascoal: d.oilgascoal,
            hydroelectric: d.hydroelectric,
            nuclear: d.nuclear
        };

        return item;
    });

    return layoutData;
}
