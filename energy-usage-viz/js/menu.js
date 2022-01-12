var menuItems = [
    {
        id: 'country',
        label: 'Country'
    },
    {
        id: 'renewable',
        label: 'Renewable'
    },
    {
        id: 'oilgascoal',
        label: 'Oil, Gas & Coal'
    },
    {
        id: 'hydroelectric',
        label: 'Hydroelectric'
    },
    {
        id: 'nuclear',
        label: 'Nuclear'
    }
];

function getCircle(id) {
    var svg = '<svg width="18" height="18"><circle class="' + id + '" cx="9" cy="9" r="8"></svg>';
    return svg;
}

function getHtml(d) {
    var circle = d.id === 'country' ? '' : getCircle(d.id);
    var html = circle + '<div class="label">' + d.label + '</div>';
    return html;
}

function handleMenuClick(e, d) {
    action('setSelectedIndicator', d.id);
}

function updateMenu() {
    d3.select('#controls .menu .items')
        .selectAll('.item')
        .data(menuItems)
        .join('div')
        .classed('item', true)
        .classed('selected', function(d) {
            return state.selectedIndicator === d.id;
        })
        .html(getHtml)
        .on('click', handleMenuClick);
}
