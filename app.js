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
    
// ======================================
// AUDIO ENGINE V6 (PART A)
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const storyCards =
        document.querySelectorAll(".story-card");

    // Ignore pages without stories
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

        const index =
            [...storyCards].indexOf(card);

        // PART B starts here...
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

    currentAudio = audio;
    currentStory = {

        title,
        category,
        page,
        index

    };

    const progress = getProgress(title);

if (progress) {

    audio.addEventListener("loadedmetadata", () => {

        audio.currentTime = progress.time;

        audio.play();

    }, { once:true });

    audio.load();

} else {

    audio.play();

audio.addEventListener("playing", () => {

    playBtn.textContent = "⏸ Playing";

}, { once:true });
 
}

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

    const mins =
        Math.floor(audio.currentTime / 60);

    const secs =
        Math.floor(audio.currentTime % 60);

    // Update timer
    timeDisplay.textContent =
        mins + ":" +
        (secs < 10 ? "0" + secs : secs);

    // Story object
    const story = {

        title,
        category,
        page,
        index,
        time: audio.currentTime

    };

    // Save progress
    saveProgress(story);

    // Make this the Continue story
    saveContinueStory(title);

    // Update Recently Played
    saveRecentlyPlayed(title);

    // Update Continue Card live
    const continueTitle =
        document.getElementById("continueTitle");

    const continueTime =
        document.getElementById("continueTime");

    if (continueTitle && continueTime) {

        continueTitle.textContent =
            title;

        continueTime.textContent =
            "Continue from " +
            mins + ":" +
            (secs < 10 ? "0" + secs : secs)
    
    }
   });    
    
    // =============================
// FINISHED
// =============================

audio.addEventListener("ended", () => {

    playBtn.textContent =
        "▶ Play";

    if (currentAudio === audio) {

        currentAudio = null;

    }

});    
    });

});

function audioResumeStory(story) {

    const cards =
        document.querySelectorAll(".story-card");

    const card =
        cards[story.index];

    if (!card) return;

    const audio =
        card.querySelector(".audio-player");

    const playBtn =
        card.querySelector(".play-btn");

    currentAudio = audio;
    currentStory = story;

audio.addEventListener("loadedmetadata", () => {

    audio.currentTime = story.time;

    audio.play();

    if (playBtn) {

        playBtn.textContent = "⏸ Playing";

    }

}, { once: true });

audio.load();
    
}

// ======================================
// CONTINUE LISTENING MANAGER V6
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const continueCard =
        document.getElementById("continueCard");

    const continueTitle =
        document.getElementById("continueTitle");

    const continueTime =
        document.getElementById("continueTime");

    const continueBtn =
        document.getElementById("continueBtn");

    if (
        !continueCard ||
        !continueTitle ||
        !continueTime ||
        !continueBtn
    ) return;

    const story =
        getContinueStory();

    if (!story) {

        continueCard.style.display = "none";

        return;

    }

    continueCard.style.display = "block";

    continueTitle.textContent =
        story.title;

    const mins =
        Math.floor(story.time / 60);

    const secs =
        Math.floor(story.time % 60);

    continueTime.textContent =
        "Continue from " +
        mins + ":" +
        (secs < 10 ? "0" + secs : secs);
  
    continueBtn.addEventListener("click", () => {

    continueCard.style.opacity = "0";

    setTimeout(() => {

        continueCard.style.display = "none";

    }, 300);

    sessionStorage.setItem(
        "storytime_resume",
        "true"
    );

    if (currentPage !== story.page) {

        window.location.href =
            story.page;

    } else {

        audioResumeStory(story);

    }

});
    
});

// ======================================
// RECENTLY PLAYED MANAGER V6
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const recentContainer =
        document.getElementById("recentStories");

    if (!recentContainer) return;

    const recent =
        getRecentlyPlayed();

    recentContainer.innerHTML = "";

    if (recent.length === 0) return;

    recent.forEach(story => {

        const item =
            document.createElement("div");

        item.className =
            "recent-item";

        item.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.category}</p>
        `;

        item.addEventListener("click", () => {

            sessionStorage.setItem(
                "storytime_resume",
                "true"
            );

            localStorage.setItem(
                "storytime_continue",
                story.title
            );

            if (currentPage !== story.page) {

                window.location.href =
                    story.page;

            } else {

                audioResumeStory(story);

            }

        });

        recentContainer.appendChild(item);

    });

});

// ======================================
// AUTO RESUME MANAGER V6
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    if (
        sessionStorage.getItem("storytime_resume") !== "true"
    ) return;

    sessionStorage.removeItem("storytime_resume");

    const story =
        getContinueStory();

    if (!story) return;

    if (currentPage !== story.page) return;

    setTimeout(() => {

        audioResumeStory(story);

    }, 300);

});
