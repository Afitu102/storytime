// ======================================
// STORYTIME APP V2
// One JavaScript for all pages
// ======================================

// Global Variables
let currentAudio = null;
let currentStory = null;

// Detect current page
const currentPage =
window.location.pathname
.split("/")
.pop();

// ======================================
// THEME MANAGER
// ======================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme") || "dark";

    document.body.setAttribute(
        "data-theme",
        savedTheme
    );

}

function toggleTheme() {

    const currentTheme =
        document.body.getAttribute("data-theme");

    const newTheme =
        currentTheme === "dark"
        ? "light"
        : "dark";

    document.body.setAttribute(
        "data-theme",
        newTheme
    );

    localStorage.setItem(
        "theme",
        newTheme
    );

}

document.addEventListener(
    "DOMContentLoaded",
    loadTheme
);

