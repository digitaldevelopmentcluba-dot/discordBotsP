let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener("mousemove", (e) => {
    const img = document.querySelector(".parallax img");
    const rect = img.getBoundingClientRect();

    const imgX = rect.left + rect.width / 2;
    const imgY = rect.top + rect.height / 2;

    targetX = -(e.clientY - imgY) / 20;
    targetY = (e.clientX - imgX) / 20;
});

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function animate() {
    const img = document.querySelector(".parallax img");

    currentX = lerp(currentX, targetX, 0.1);
    currentY = lerp(currentY, targetY, 0.1);

    img.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

    requestAnimationFrame(animate);
}

animate();