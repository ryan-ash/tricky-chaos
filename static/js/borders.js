const lineSize = 20;

let horizontalLinePartsTop = [];
let horizontalLinePartsBottom = [];
let verticalLinePartsLeft = [];
let verticalLinePartsRight = [];

let prevHorizontalIndex = null;
let prevVerticalIndex = null;

let cursorLines = []
let dashedLines = [];

let isHoveringOverLink = false;

function createLineParts() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const numHorizontalLines = Math.ceil(windowWidth / lineSize);
    const numVerticalLines = Math.ceil(windowHeight / lineSize);

    $('#left, #right').addClass('vertical-container');

    for (let i = 0; i < numHorizontalLines; i++) {
        const horizontalLine = $(`<div class="line horizontal" data-x="${i}"></div>`);
        $('#top').append(horizontalLine);
        horizontalLinePartsTop[i] = horizontalLine;
        const horizontalLineBottom = horizontalLine.clone();
        $('#bottom').append(horizontalLineBottom);
        horizontalLinePartsBottom[i] = horizontalLineBottom;
    }

    for (let i = 0; i < numVerticalLines; i++) {
        const verticalLine = $(`<div class="line vertical" data-y="${i}"></div>`);
        $('#left').append(verticalLine);
        verticalLinePartsLeft[i] = verticalLine;
        const verticalLineRight = verticalLine.clone();
        $('#right').append(verticalLineRight);
        verticalLinePartsRight[i] = verticalLineRight;
    }
}

function createCursorLines() {
    cursorLines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cursorLines.id = "cursor-lines";
    cursorLines.style.position = "fixed";
    cursorLines.style.top = "0";
    cursorLines.style.width = "100%";
    cursorLines.style.height = "100%";
    cursorLines.style.pointerEvents = "none";
    cursorLines.style.zIndex = "2";

    for (let i = 0; i < 4; i++) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.style.stroke = "#0aa";
        line.style.strokeWidth = "1px";
        line.style.opacity = "0.5";
        cursorLines.appendChild(line);
    }

    document.body.appendChild(cursorLines);
}

function createAdjacentStyles(numAdjacentParts) {
    const styles = [];
    const minOpacity = 0.5;

    for (let i = 0; i < numAdjacentParts; i++) {
        const rotation = 90 - 90 * (i + 1) / (numAdjacentParts + 1);
        const opacity = minOpacity + ((1 - minOpacity) * (i + 1) / (numAdjacentParts + 1));
        const backgroundColor = Math.floor(85 + (170 * (numAdjacentParts - i)) / (numAdjacentParts + 1));

        styles.push({
            transform: `rotate(${rotation}deg)`,
            opacity: opacity,
            backgroundColor: `rgb(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`,
        });
    }

    return styles;
}


function markItem(list, startingIndex, adjacentStyles) {
    list[startingIndex].addClass('current-cursor');

    for (let i = 0; i < adjacentStyles.length; i++) {
        const lowerIndex = startingIndex - (i + 1);
        const higherIndex = startingIndex + (i + 1);
        let selectedStyle = adjacentStyles[i];

        if (list[lowerIndex]) {
            list[lowerIndex].css(selectedStyle);
        }
        if (list[higherIndex]) {
            list[higherIndex].css(selectedStyle);
        }
    }
}


function updateCursorLines(x, y, adjacentStyles) {
    const horizontalIndex = Math.floor(x / lineSize);
    const verticalIndex = Math.floor(y / lineSize);

    if (horizontalIndex !== prevHorizontalIndex || verticalIndex !== prevVerticalIndex) {
        $(".current-cursor").each(function() {
            $(this).removeClass("current-cursor");
            const dataIndex = $(this).hasClass("horizontal") ? "x" : "y";

            for (let i = 0; i < adjacentStyles.length; i++) {
                const lowerIndex = parseInt($(this).data(dataIndex)) - (i + 1);
                const higherIndex = parseInt($(this).data(dataIndex)) + (i + 1);

                const lines = $(this).parent().children();

                if (lines[lowerIndex]) {
                    $(lines[lowerIndex]).removeAttr("style");
                }
                if (lines[higherIndex]) {
                    $(lines[higherIndex]).removeAttr("style");
                }
            }
        });

        if (horizontalLinePartsTop[horizontalIndex]) {
            markItem(horizontalLinePartsTop, horizontalIndex, adjacentStyles);
        }
        if (horizontalLinePartsBottom[horizontalIndex]) {
            markItem(horizontalLinePartsBottom, horizontalIndex, adjacentStyles);
        }
        if (verticalLinePartsLeft[verticalIndex]) {
            markItem(verticalLinePartsLeft, verticalIndex, adjacentStyles);
        }
        if (verticalLinePartsRight[verticalIndex]) {
            markItem(verticalLinePartsRight, verticalIndex, adjacentStyles);
        }

        prevHorizontalIndex = horizontalIndex;
        prevVerticalIndex = verticalIndex;
    }
}

function createDashedLines() {
    for (let i = 0; i < 4; i++) {
        const dashedLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        dashedLine.style.stroke = "#555";
        dashedLine.style.opacity = 0.22;
        dashedLine.style.strokeWidth = "1px";
        dashedLine.style.strokeDasharray = "22, 50";
        dashedLine.style.strokeDashoffset = "20";
        cursorLines.appendChild(dashedLine);
        dashedLines.push(dashedLine);
    }
}

function updateDashedLines(x, y) {
    const lines = cursorLines.children;
    const padding_x = 20;
    const padding_y = 15;
    const corners = [
        { x: padding_x, y: padding_y },
        { x: window.innerWidth - padding_x, y: padding_y },
        { x: padding_x, y: window.innerHeight - padding_y },
        { x: window.innerWidth - padding_x, y: window.innerHeight - padding_y },
    ];

    for (let i = 0; i < corners.length; i++) {
        const corner = corners[i];
        const dist = distance(x, y, corner.x, corner.y);
        const maxDist = distance(0, 0, window.innerWidth, window.innerHeight);
        const normalizedDist = 1 - normalize(dist, 0, maxDist);
        const minOpacity = 0.2;
        const maxOpacity = 0.8;
        const linkOpacity = isHoveringOverLink ? 0.1 : 0;
        const opacity = minOpacity + normalizedDist * (maxOpacity - minOpacity) + linkOpacity;

        lines[i].setAttribute("x1", corner.x);
        lines[i].setAttribute("y1", corner.y);
        lines[i].setAttribute("x2", x);
        lines[i].setAttribute("y2", y);
        lines[i].style.stroke = isHoveringOverLink ? `rgba(100, 222, 200, ${opacity})` : `rgba(0, 100, 100, ${opacity})`;
    }

    const borderPositions = [
        { x: prevHorizontalIndex * lineSize + 10, y: 0 },
        { x: prevHorizontalIndex * lineSize + 10, y: window.innerHeight },
        { x: 0, y: prevVerticalIndex * lineSize + 3 },
        { x: window.innerWidth, y: prevVerticalIndex * lineSize + 3 },
    ];

    for (let i = 0; i < dashedLines.length; i++) {
        dashedLines[i].setAttribute("x1", borderPositions[i].x);
        dashedLines[i].setAttribute("y1", borderPositions[i].y);
        dashedLines[i].setAttribute("x2", x);
        dashedLines[i].setAttribute("y2", y);
    }
}

function animateDashedLines() {
    for (let i = 0; i < dashedLines.length; i++) {
        const currentOffset = parseFloat(dashedLines[i].style.strokeDashoffset);
        dashedLines[i].style.strokeDashoffset = currentOffset - 1;
    }
    requestAnimationFrame(animateDashedLines);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function updateLines(x, y, adjacentStyles) {
    updateCursorLines(x, y, adjacentStyles);
    updateDashedLines(x, y);
}

$(document).ready(function () {
    createLineParts();
    createCursorLines();
    createDashedLines();
    animateDashedLines();
    document.body.style.cursor = "none";

    const numAdjacentParts = 5;
    const adjacentStyles = createAdjacentStyles(numAdjacentParts);

    $(window).resize(function () {
        $('#top, #bottom, #left, #right').empty();
        createLineParts();
    });

    $(document).mousemove(function (e) {
        const x = e.clientX;
        const y = e.clientY;
        updateLines(x, y, adjacentStyles);
    });
});

$('body').on('mouseenter', 'a', function() {
    isHoveringOverLink = true;
});

$('body').on('mouseleave', 'a', function() {
    isHoveringOverLink = false;
});
