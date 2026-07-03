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

// ======================================
// STORAGE ENGINE V6
// ======================================

// ---------- STORY PROGRESS ----------

function getAllProgress() {

    return JSON.parse(

        localStorage.getItem("storytime_progress")

    ) || {};

}

function saveProgress(story) {

    const progress = getAllProgress();

    progress[story.title] = story;

    localStorage.setItem(

        "storytime_progress",

        JSON.stringify(progress)

    );

}

function getProgress(title) {

    const progress = getAllProgress();

    return progress[title] || null;

}

// ---------- CONTINUE LISTENING ----------

function saveContinueStory(title) {

    localStorage.setItem(

        "storytime_continue",

        title

    );

}

function getContinueStory() {

    const title =

        localStorage.getItem("storytime_continue");

    if (!title) return null;

    return getProgress(title);

}

// ---------- RECENTLY PLAYED ----------

function saveRecentlyPlayed(title) {

    let recent = JSON.parse(

        localStorage.getItem("storytime_recent")

    ) || [];

    recent = recent.filter(

        item => item !== title

    );

    recent.unshift(title);

    recent = recent.slice(0, 2);

    localStorage.setItem(

        "storytime_recent",

        JSON.stringify(recent)

    );

}

function getRecentlyPlayed() {

    const recent = JSON.parse(

        localStorage.getItem("storytime_recent")

    ) || [];

    return recent

        .map(title => getProgress(title))

        .filter(Boolean);

}
    
