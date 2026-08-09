function toggleMenu() {
    const menu = document.getElementById("navMenu");
    const burger = document.querySelector(".hamburger");

    menu.classList.toggle("show");
    burger.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const root = document.documentElement;
    const icon = document.getElementById("themeIcon");

    if (savedTheme === "light") {
        root.classList.add("light");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }
});

function toggleTheme() {
    const root = document.documentElement;
    const icon = document.getElementById("themeIcon");
    const btn = document.querySelector(".theme-toggle");

    btn.classList.add("animate");
    setTimeout(() => btn.classList.remove("animate"), 400);

    root.classList.toggle("light");

    if (root.classList.contains("light")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        localStorage.setItem("theme", "light");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        localStorage.setItem("theme", "dark");
    }
}