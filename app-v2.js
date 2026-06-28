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
// STORAGE MANAGER
// ======================================

function saveProgress(story){

    localStorage.setItem(
        "storytime_progress",
        JSON.stringify(story)
    );

}

function getProgress(){

    const data =
        localStorage.getItem("storytime_progress");

    return data
        ? JSON.parse(data)
        : null;

}

function saveRecentlyPlayed(story){

    let recent =
        JSON.parse(
            localStorage.getItem("storytime_recent")
        ) || [];

    // Remove duplicate
    recent =
        recent.filter(item => item.title !== story.title);

    // Add newest first
    recent.unshift(story);

    // Keep only latest 2
    recent = recent.slice(0,2);

    localStorage.setItem(
        "storytime_recent",
        JSON.stringify(recent)
    );

}

function getRecentlyPlayed(){

    return JSON.parse(
        localStorage.getItem("storytime_recent")
    ) || [];

}


// ======================================
// AUDIO MANAGER
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const storyCards =
        document.querySelectorAll(".story-card");

    // Ignore pages without stories (like Homepage)
    if (storyCards.length === 0) return;

    storyCards.forEach(card => {

        const audio =
            card.querySelector(".audio-player");

        const playBtn =
            card.querySelector(".play-btn");

        const pauseBtn =
            card.querySelector(".pause-btn");

        const timeDisplay =
            card.querySelector(".time");

        const title =
            card.querySelector("h2").textContent;

        const category =
            card.dataset.category;

        const page =
            card.dataset.page;

        // =============================
        // PLAY
        // =============================

        playBtn.addEventListener("click", () => {

            // Stop previous audio
            if (currentAudio && currentAudio !== audio) {

                currentAudio.pause();

                document
                    .querySelectorAll(".play-btn")
                    .forEach(btn => {

                        btn.textContent = "▶ Play";

                    });

            }

            audio.play();

            currentAudio = audio;

            currentStory = {

                title,
                category,
                page

            };

            playBtn.textContent =
                "⏸ Playing";

        });

        // =============================
        // PAUSE
        // =============================

        pauseBtn.addEventListener("click", () => {

            audio.pause();

            playBtn.textContent =
                "▶ Play";


});
      // =============================
// SAVE PROGRESS
// =============================

audio.addEventListener("timeupdate", () => {

    if (!currentStory) return;

    // Update timer
    const mins = Math.floor(audio.currentTime / 60);
    const secs = Math.floor(audio.currentTime % 60);

    timeDisplay.textContent =
        mins + ":" + (secs < 10 ? "0" + secs : secs);

    // Save current progress
    saveProgress({

    title: currentStory.title,

    category: currentStory.category,

    page: currentStory.page,

    time: audio.currentTime,

    index: [...document.querySelectorAll(".story-card")].indexOf(card)

});

});      
    

        // =============================
        // FINISHED
        // =============================

        audio.addEventListener("ended", () => {

    playBtn.textContent =
        "▶ Play";

});

    });

});

// ======================================
// SMART RESUME MANAGER
// ======================================

function resumeStory() {

    const progress = getProgress();

    if (!progress) return;

    // Wrong page? Go to the correct one.
    if (currentPage !== progress.page) {

        sessionStorage.setItem(
            "storytime_resume",
            "true"
        );

        window.location.href = progress.page;

        return;

    }

    // We are already on the correct page.
    sessionStorage.setItem(
        "storytime_resume",
        "true"
    );

}


// ======================================
// AUTO RESUME AFTER PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    if (
        sessionStorage.getItem("storytime_resume") !== "true"
    ) return;

    sessionStorage.removeItem("storytime_resume");

    const progress = getProgress();

    if (!progress) return;

    const cards =
        document.querySelectorAll(".story-card");

    const card =
        cards[progress.index];

    if (!card) return;

    card.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });
       const audio =
    card.querySelector(".audio-player");

if (!audio) return;

audio.currentTime =
    progress.time;

    currentAudio = audio;

audio.play();

const playBtn =
    card.querySelector(".play-btn");

if (playBtn) {

    playBtn.textContent =
        "⏸ Playing";

}

});
                       
