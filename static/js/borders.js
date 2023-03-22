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

function markItem(list, startingIndex) {
  list[startingIndex].addClass('current-cursor');

  adjacentClasses = ['current-cursor-adjacent', 'current-cursor-adjacent-two', 'current-cursor-adjacent-three'];

  for (let i = 0; i < adjacentClasses.length; i++) {
    actualOffset = i + 1;
    lowerIndex = startingIndex - actualOffset;
    higherIndex = startingIndex + actualOffset;

    if (list[lowerIndex]) {
      list[lowerIndex].addClass(adjacentClasses[i]);
    }
    if (list[higherIndex]) {
      list[higherIndex].addClass(adjacentClasses[i]);
    }
  }
}

function updateCursorLines(x, y) {
  const horizontalIndex = Math.floor(x / lineSize);
  const verticalIndex = Math.floor(y / lineSize);

  if (horizontalIndex !== prevHorizontalIndex || verticalIndex !== prevVerticalIndex) {
    classesToClear = ['current-cursor', 'current-cursor-adjacent', 'current-cursor-adjacent-two', 'current-cursor-adjacent-three'];
    for (let i = 0; i < classesToClear.length; i++) {
      $(`.${classesToClear[i]}`).removeClass(classesToClear[i]);
    }

    if (horizontalLinePartsTop[horizontalIndex]) {
      markItem(horizontalLinePartsTop, horizontalIndex);
    }
    if (horizontalLinePartsBottom[horizontalIndex]) {
      markItem(horizontalLinePartsBottom, horizontalIndex);
    }
    if (verticalLinePartsLeft[verticalIndex]) {
      markItem(verticalLinePartsLeft, verticalIndex);
    }
    if (verticalLinePartsRight[verticalIndex]) {
      markItem(verticalLinePartsRight, verticalIndex);
    }

    prevHorizontalIndex = horizontalIndex;
    prevVerticalIndex = verticalIndex;
  }
}

$(document).ready(function () {
  createLineParts();

  $(window).resize(function () {
    $('#top, #bottom, #left, #right').empty();
    createLineParts();
  });

  $(document).mousemove(function (e) {
    const x = e.clientX;
    const y = e.clientY;
    updateCursorLines(x, y);
  });
});
