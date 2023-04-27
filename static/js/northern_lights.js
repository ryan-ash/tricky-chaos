class Light {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = Math.random() * 6 - 3; // Delta X
        this.dy = Math.random() * 6 - 3; // Delta Y
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(ctx) {
        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw(ctx);
    }
}

let lights = [];

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    for (let i = 0; i < 100; i++) {
        const radius = Math.random() * 4 + 1;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = `rgba(0, ${Math.random() * 22}, ${Math.random() * 22}, 0.2)`;
        lights.push(new Light(x, y, radius, color));
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let light of lights) {
            light.update(ctx);
        }
    }

    animate();
});

document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const color = `rgba(0, ${Math.random() * 22}, ${Math.random() * 22}, 0.2)`;
    if(lights.length >= 222) {
        lights.shift(); // Remove the oldest light
    }
    lights.push(new Light(mouseX, mouseY, Math.random() * 4 + 1, color));
});
