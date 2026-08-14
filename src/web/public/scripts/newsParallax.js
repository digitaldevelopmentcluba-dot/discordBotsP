document.querySelectorAll(".thumb-wrapper").forEach(wrapper => {
    const image = wrapper.querySelector(".thumb-parallax");

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const strength = 15;
    const smoothing = 0.1;

    wrapper.addEventListener("mousemove", (event) => {
        const rect = wrapper.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width * 2 - 1;
        const y = (event.clientY - rect.top) / rect.height * 2 - 1;

        targetX = x * strength;
        targetY = y * strength;
    });

    wrapper.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;
    });

    function animate() {
        currentX += (targetX - currentX) * smoothing;
        currentY += (targetY - currentY) * smoothing;

        image.style.setProperty("--parallax-x", `${currentX}px`);
        image.style.setProperty("--parallax-y", `${currentY}px`);

        requestAnimationFrame(animate);
    }

    animate();
});