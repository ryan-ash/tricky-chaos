document.addEventListener("DOMContentLoaded", function () {
    const cursorLines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cursorLines.id = "cursor-lines";
    cursorLines.style.position = "fixed";
    cursorLines.style.top = "0";
    cursorLines.style.width = "100%";
    cursorLines.style.height = "100%";
    cursorLines.style.pointerEvents = "none";
    cursorLines.style.zIndex = "2";

    for (let i = 0; i < 4; i++) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.style.stroke = "rgba(0, 100, 100, 0.5)";
        line.style.strokeWidth = "1px";
        cursorLines.appendChild(line);
    }

    document.body.appendChild(cursorLines);

    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    function normalize(value, min, max) {
        return (value - min) / (max - min);
    }
    
    document.addEventListener("mousemove", function (e) {
        const lines = cursorLines.children;
        const x = e.clientX;
        const y = e.clientY;
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
            const opacity = minOpacity + normalizedDist * (maxOpacity - minOpacity);
    
            lines[i].setAttribute("x1", corner.x);
            lines[i].setAttribute("y1", corner.y);
            lines[i].setAttribute("x2", x);
            lines[i].setAttribute("y2", y);
            lines[i].style.stroke = `rgba(0, 100, 100, ${opacity})`;
        }
    });
    
    // Hide the cursor
    document.body.style.cursor = "none";
});
