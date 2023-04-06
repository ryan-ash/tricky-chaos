const faviconCanvas = document.createElement('canvas');
faviconCanvas.width = 16;
faviconCanvas.height = 16;
const faviconCtx = faviconCanvas.getContext('2d');
const faviconLink = document.getElementById('favicon');

function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
    const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    const a = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / d;
    const b = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / d;
    const c = 1 - a - b;
  
    return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
}
  
function getTriangleIndex(x, y) {
    if (pointInTriangle(x, y, 0, 0, 8, 8, 0, 16)) return 0;
    if (pointInTriangle(x, y, 0, 0, 8, 8, 16, 0)) return 1;
    if (pointInTriangle(x, y, 0, 16, 8, 8, 16, 16)) return 2;
    return -1;
}
  
function setFavicon(x, y) {
    faviconCtx.clearRect(0, 0, 16, 16);
  
    // Draw triangles
    const triangleColors = [
        { color: '#000', brighterColor: '#222' },
        { color: '#000', brighterColor: '#222' },
        { color: '#000', brighterColor: '#222' },
    ];
  
    // Determine the triangle index where the pixel is located
    const triangleIndex = getTriangleIndex(x, y);
    if (triangleIndex >= 0) {
        triangleColors[triangleIndex].color = triangleColors[triangleIndex].brighterColor;
    }
  
    // Left triangle
    faviconCtx.fillStyle = triangleColors[0].color;
    faviconCtx.beginPath();
    faviconCtx.moveTo(0, 0);
    faviconCtx.lineTo(8, 8);
    faviconCtx.lineTo(0, 16);
    faviconCtx.closePath();
    faviconCtx.fill();
  
    // Top triangle
    faviconCtx.fillStyle = triangleColors[1].color;
    faviconCtx.beginPath();
    faviconCtx.moveTo(0, 0);
    faviconCtx.lineTo(8, 8);
    faviconCtx.lineTo(16, 0);
    faviconCtx.closePath();
    faviconCtx.fill();
  
    // Bottom triangle
    faviconCtx.fillStyle = triangleColors[2].color;
    faviconCtx.beginPath();
    faviconCtx.moveTo(0, 16);
    faviconCtx.lineTo(8, 8);
    faviconCtx.lineTo(16, 16);
    faviconCtx.closePath();
    faviconCtx.fill();
  
    // Draw the green pixel if it's inside the big triangle
    if (triangleIndex >= 0) {
        faviconCtx.fillStyle = 'green';
        faviconCtx.fillRect(x, y, 1, 1);
    }
  
    faviconLink.href = faviconCanvas.toDataURL('image/png');
}


let isUpdating = false;

document.addEventListener('mousemove', (e) => {
    if (isUpdating) return;

    isUpdating = true;
    const x = Math.floor((e.clientX / window.innerWidth) * 16);
    const y = Math.floor((e.clientY / window.innerHeight) * 16);

    requestAnimationFrame(() => {
        setFavicon(x, y);
        isUpdating = false;
    });
});
