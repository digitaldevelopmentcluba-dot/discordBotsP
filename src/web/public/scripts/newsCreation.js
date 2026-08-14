const openBtn = document.getElementById("openCreateMenu");
const menu = document.getElementById("createMenu");
const overlay = document.getElementById("createMenuOverlay");

openBtn.addEventListener("click", () => {
    menu.classList.add("open");
    overlay.classList.add("visible");
});

overlay.addEventListener("click", () => {
    menu.classList.remove("open");
    overlay.classList.remove("visible");
});