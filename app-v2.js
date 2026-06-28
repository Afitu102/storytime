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

// ======================================
// THEME BUTTON
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const themeBtn =
        document.getElementById("themeToggle");

    if (!themeBtn) return;

    function updateThemeButton() {

        const theme =
            document.body.getAttribute("data-theme");

        if (theme === "dark") {

            themeBtn.innerHTML =
                "🌙 Dark Mode";

        } else {

            themeBtn.innerHTML =
                "☀️ Light Mode";

        }

    }

    updateThemeButton();

    themeBtn.addEventListener("click", () => {

        toggleTheme();

        updateThemeButton();

    });

});


