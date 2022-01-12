var popup = Popup();

function getPopupEntry(d, type, label) {
    if (d.popupData[type] !== null) {
        return '<div>' + label + ': ' + d.popupData[type] + '%</div>';
    }

    return '';
}

function popupTemplate(d) {
    var html = '';
    html += '<h3>' + d.popupData.name + '</h3>';

    html += getPopupEntry(d, 'renewable', 'Renewable');
    html += getPopupEntry(d, 'oilgascoal', 'Oil, Gas & Coal');
    html += getPopupEntry(d, 'hydroelectric', 'Hydroelectric');
    html += getPopupEntry(d, 'nuclear', 'Nuclear');

    return html;
}

function handleMouseover(e, d) {
    var popupCenter = d3.select(this)
        .select('.popup-center')
        .node();

    popup
        .point(popupCenter)
        .html(popupTemplate(d))
        .draw();
}

function handleMouseout() {
    popup.hide();
}
