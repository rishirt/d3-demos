function dataIsReady(csv) {
    action('setData', csv);
}

function parseNumber(d) {
    return d === "" ? null : +d;
}

function transformRow(d) {
    return {
        name: d.name,
        id: d.id,
        hydroelectric: parseNumber(d.hydroelectric),
        nuclear: parseNumber(d.nuclear),
        oilgascoal: parseNumber(d.oilgascoal),
        renewable: parseNumber(d.renewable)
    };
}

d3.csv('data/data.csv', transformRow)
    .then(dataIsReady);
