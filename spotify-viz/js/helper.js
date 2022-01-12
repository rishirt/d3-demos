/*! project-name v0.0.1 | (c) 2020 YOUR NAME | MIT License | http://link-to-your-git-repo.com */
/*************************************************/
/* Helper functions                              */
/*************************************************/

// Convert degrees to radians
const degreesToRadians = (angle) => {
  return angle * Math.PI / 180;
};

// Get sizes of an svg element
const getSizes = (id) => {
  return document.getElementById(id).getBBox();
};

// Wrap text - Function originally written by Mike Bostocks
const wrap = (text, width) => {
  text.each((function() {
    let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  }));
};