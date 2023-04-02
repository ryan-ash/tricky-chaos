const lineSize = 15;
const numAdjacentParts = 5;

let horizontalLinePartsTop = [];
let horizontalLinePartsBottom = [];
let verticalLinePartsLeft = [];
let verticalLinePartsRight = [];

let prevHorizontalIndex = null;
let prevVerticalIndex = null;

let cursorLines = []
let dashedLines = [];

let isHoveringOverLink = false;
let linkLocation = {x: 0, y: 0};
const circleSize = 66;

let lineScreenOffset = 20;
let lineTopOffset = 0;
let lineBottomOffset = 30;

let lineOffsetMax = 20;

let corners = [];

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
    const topStyles = [];
    const bottomStyles = [];
    const leftStyles = [];
    const rightStyles = [];
    const minOpacity = 0.5;

    for (let i = 0; i < numAdjacentParts; i++) {
        const rotation = 90 - 90 * (i + 1) / (numAdjacentParts + 1);
        const opacity = minOpacity + ((1 - minOpacity) * (i + 1) / (numAdjacentParts + 1));
        const backgroundColor = Math.floor(45 + (120 * (numAdjacentParts - i)) / (numAdjacentParts + 1));
        const offset = Math.floor((numAdjacentParts - i) / (numAdjacentParts + 1) * 18);

        topStyleObject = {
            opacity: opacity,
            backgroundColor: `rgb(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`,
            transform: `translateY(${offset}px) rotate(${rotation}deg)`
        };

        bottomStyleObject = {
            opacity: opacity,
            backgroundColor: `rgb(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`,
            transform: `translateY(-${offset}px) rotate(${rotation}deg)`
        };

        leftStyleObject = {
            opacity: opacity,
            backgroundColor: `rgb(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`,
            transform: `translateX(${offset}px) rotate(${rotation}deg)`
        };

        rightStyleObject = {
            opacity: opacity,
            backgroundColor: `rgb(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`,
            transform: `translateX(-${offset}px) rotate(${rotation}deg)`
        };

        topStyles.push(topStyleObject);
        bottomStyles.push(bottomStyleObject);
        leftStyles.push(leftStyleObject);
        rightStyles.push(rightStyleObject);
    }

    return [topStyles, bottomStyles, leftStyles, rightStyles];
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

            for (let i = 0; i < adjacentStyles[0].length; i++) {
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
            markItem(horizontalLinePartsTop, horizontalIndex, adjacentStyles[0]);
        }
        if (horizontalLinePartsBottom[horizontalIndex]) {
            markItem(horizontalLinePartsBottom, horizontalIndex, adjacentStyles[1]);
        }
        if (verticalLinePartsLeft[verticalIndex]) {
            markItem(verticalLinePartsLeft, verticalIndex, adjacentStyles[2]);
        }
        if (verticalLinePartsRight[verticalIndex]) {
            markItem(verticalLinePartsRight, verticalIndex, adjacentStyles[3]);
        }

        prevHorizontalIndex = horizontalIndex;
        prevVerticalIndex = verticalIndex;
    }
}

function getIntersectionPoints(x1, y1, x2, y2, cx, cy, r) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const a = dx * dx + dy * dy;
    const b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
    const c = (x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy) - r * r;
    const det = b * b - 4 * a * c;

    if (det < 0) {
        return null;
    } else {
        const t1 = (-b - Math.sqrt(det)) / (2 * a);
        const t2 = (-b + Math.sqrt(det)) / (2 * a);

        const intersection1 = {
            x: x1 + t1 * dx,
            y: y1 + t1 * dy,
        };

        const intersection2 = {
            x: x1 + t2 * dx,
            y: y1 + t2 * dy,
        };

        return [intersection1, intersection2];
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
    const circleRadius = circleSize / 2;

    for (let i = 0; i < corners.length; i++) {
        const corner = corners[i];

        const intersectionPoints = getIntersectionPoints(corner.x, corner.y, x, y, linkLocation.x, linkLocation.y, circleRadius);
        if (isHoveringOverLink) {
            if (intersectionPoints) {
                const intersection = intersectionPoints[0]; // Choose the first intersection point

                lines[i].setAttribute("x2", intersection.x);
                lines[i].setAttribute("y2", intersection.y);
            } else {
                lines[i].setAttribute("x2", x);
                lines[i].setAttribute("y2", y);    
            }
        } else {
            lines[i].setAttribute("x2", x);
            lines[i].setAttribute("y2", y);
        }

        const dist = distance(x, y, corner.x, corner.y);
        const maxDist = distance(0, 0, window.innerWidth, window.innerHeight);
        const normalizedDist = 1 - normalize(dist, 0, maxDist);
        const minOpacity = 0.2;
        const maxOpacity = 0.8;
        const linkOpacity = isHoveringOverLink ? 0.1 : 0;
        const opacity = minOpacity + normalizedDist * (maxOpacity - minOpacity) + linkOpacity;

        lines[i].setAttribute("x1", corner.x);
        lines[i].setAttribute("y1", corner.y);
        lines[i].style.stroke = isHoveringOverLink ? `rgba(100, 222, 200, ${opacity})` : `rgba(0, 100, 100, ${opacity})`;
    }

    const borderPositions = [
        { x: prevHorizontalIndex * lineSize + 8, y: 0 },
        { x: prevHorizontalIndex * lineSize + 8, y: window.innerHeight },
        { x: 0, y: prevVerticalIndex * lineSize + 7 },
        { x: window.innerWidth, y: prevVerticalIndex * lineSize + 7 },
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

function updateObjectPosition(name, top, right) {
    const borderOffset = 20;
    const finalTop = top/2 + borderOffset;
    const finalRight = right/2 + borderOffset;
    $("." + name).css({
        "top": finalTop + "px",
        "right": finalRight + "px"
    });
}

function updateMainTitlePosition(top, right) {
    updateObjectPosition("main-content", top, right);
}

function updateProjectsPosition(top, right) {
    updateObjectPosition("projects", top, right);
}

function updateLineOffsets(x, y) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const offsetX = Math.floor(lineOffsetMax * x / windowWidth);
    const offsetXInverted = Math.floor(lineOffsetMax * (1 - x / windowWidth));
    const offsetY = Math.floor(lineOffsetMax * y / windowHeight);
    const offsetYInverted = Math.floor(lineOffsetMax * (1 - y / windowHeight));

    const offsetLeft = lineScreenOffset + offsetX;
    const offsetRight = lineScreenOffset + offsetXInverted;
    const offsetTop = lineTopOffset + offsetY;
    const offsetBottom = lineBottomOffset + offsetYInverted;
    const padding_y = 15;

    corners = [
        { x: offsetLeft, y: offsetTop + padding_y },
        { x: window.innerWidth - offsetRight, y: offsetTop + padding_y },
        { x: offsetLeft, y: window.innerHeight - offsetBottom + padding_y },
        { x: window.innerWidth - offsetRight, y: window.innerHeight - offsetBottom + padding_y },
    ];

    updateMainTitlePosition(offsetTop + padding_y, offsetRight);
    updateProjectsPosition(offsetTop + padding_y, offsetRight);

    $('#left').css('left', `${offsetLeft}px`);
    $('#right').css('right', `${offsetRight}px`);
    $('#top').css('top', `${offsetTop}px`);
    $('#bottom').css('bottom', `${offsetBottom}px`);
}

function updateLines(x, y, adjacentStyles) {
    updateCursorLines(x, y, adjacentStyles);
    updateLineOffsets(x, y);
    updateDashedLines(x, y);
}

function recordLinkLocation(element) {
    const rect = element.getBoundingClientRect();
    linkLocation.x = rect.left + (rect.width / 2);
    linkLocation.y = rect.top + (rect.height / 2);
}

function showDashedCircle() {
    const circle = $('.rotating-dashed-circle');

    if (isHoveringOverLink) {
        circle.css({
            'width': `${circleSize}px`,
            'height': `${circleSize}px`,
            'left': `${linkLocation.x - circleSize / 2 + 1}px`,
            'top': `${linkLocation.y - circleSize / 2 + 1}px`,
            'opacity': 1
        });
    } else {
        circle.css('opacity', 0);
    }
}

// Call showDashedCircle on every frame
function animate() {
    showDashedCircle();
    requestAnimationFrame(animate);
}

$(document).ready(function () {
    createLineParts();
    createCursorLines();
    createDashedLines();
    animateDashedLines();
    document.body.style.cursor = "none";

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

    animate();
});

$('body').on('mouseenter', 'a', function() {
    isHoveringOverLink = true;
    recordLinkLocation(this);
});

$('body').on('mouseleave', 'a', function() {
    isHoveringOverLink = false;
});
