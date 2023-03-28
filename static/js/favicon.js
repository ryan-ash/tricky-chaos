const faviconCanvas = document.createElement('canvas');
faviconCanvas.width = 16;
faviconCanvas.height = 16;
const faviconCtx = faviconCanvas.getContext('2d');
const faviconLink = document.getElementById('favicon');

function setFavicon(x, y) {
  faviconCtx.fillStyle = 'black';
  faviconCtx.fillRect(0, 0, 16, 16);

  // Draw a larger, semi-transparent circle around the main pixel
  faviconCtx.fillStyle = 'rgba(0, 100, 0, 0.3)';
  faviconCtx.beginPath();
  faviconCtx.arc(x, y, 2, 0, 2 * Math.PI);
  faviconCtx.fill();

  faviconCtx.fillStyle = 'green';
  faviconCtx.fillRect(x, y, 1, 1);

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
