const lineSize = 20;

let horizontalLinePartsTop = [];
let horizontalLinePartsBottom = [];
let verticalLinePartsLeft = [];
let verticalLinePartsRight = [];

let prevHorizontalIndex = null;
let prevVerticalIndex = null;

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

        if (list[lowerIndex]) {
            list[lowerIndex].css(adjacentStyles[i]);
        }
        if (list[higherIndex]) {
            list[higherIndex].css(adjacentStyles[i]);
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


$(document).ready(function () {
    createLineParts();
    const numAdjacentParts = 5;
    const adjacentStyles = createAdjacentStyles(numAdjacentParts);

    $(window).resize(function () {
        $('#top, #bottom, #left, #right').empty();
        createLineParts();
    });

    $(document).mousemove(function (e) {
        const x = e.clientX;
        const y = e.clientY;
        updateCursorLines(x, y, adjacentStyles);
    });
});
