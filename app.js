// ======================================
// STORYTIME APP.JS
// Version 2.0
// ======================================

// -----------------------------
// GLOBAL VARIABLES
// -----------------------------

let currentAudio = null;

const continueCard = document.getElementById("continueCard");
const continueTitle = document.getElementById("continueTitle");
const continueTime = document.getElementById("continueTime");
const continueBtn = document.getElementById("continueBtn");

// -----------------------------
// FORMAT TIME
// -----------------------------

function formatTime(seconds){

    seconds = Math.floor(seconds);

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return mins + ":" + String(secs).padStart(2,"0");

}

// -----------------------------
// SAVE CONTINUE LISTENING
// -----------------------------

function saveProgress(card, audio){

    localStorage.setItem(
        "storyTitle",
        card.querySelector("h2").textContent
    );

    localStorage.setItem(
        "storyTime",
        audio.currentTime
    );

    localStorage.setItem(
        "storyIndex",
        [...document.querySelectorAll(".audio-player")]
        .indexOf(audio)
    );

}

// -----------------------------
// SAVE RECENTLY PLAYED
// -----------------------------

function saveRecentStory(card, audio){

    const title = card.querySelector("h2").textContent;

    const category = card.dataset.category;

    const page = card.dataset.page;

    let recentStories =
        JSON.parse(localStorage.getItem("recentStories")) || [];

    recentStories =
        recentStories.filter(story => story.title !== title);

recentStories.unshift({

    title: title,

    category: category,

    page: page,

    time: audio.currentTime

});

    recentStories = recentStories.slice(0,2);

    localStorage.setItem(
        "recentStories",
        JSON.stringify(recentStories)
    );

}

// -----------------------------
// AUDIO PLAYER
// -----------------------------

document.querySelectorAll(".story-card").forEach(card => {

    const audio = card.querySelector(".audio-player");
    const playBtn = card.querySelector(".play-btn");
    const pauseBtn = card.querySelector(".pause-btn");
    const timeDisplay = card.querySelector(".time");

    playBtn.addEventListener("click", () => {

        // Stop any other playing audio
        if (currentAudio && currentAudio !== audio) {

            currentAudio.pause();

            document.querySelectorAll(".play-btn").forEach(btn => {
                btn.textContent = "▶ Play";
            });

        }

        audio.play();

        currentAudio = audio;

        playBtn.textContent = "⏸ Playing";

        saveRecentStory(card);

    });

    pauseBtn.addEventListener("click", () => {

        audio.pause();

        playBtn.textContent = "▶ Play";

    });

    audio.addEventListener("timeupdate", () => {

        timeDisplay.textContent =
            formatTime(audio.currentTime);

        saveProgress(card, audio);

    });

    audio.addEventListener("ended", () => {

        playBtn.textContent = "▶ Play";

    });

});

// -----------------------------
// CONTINUE LISTENING
// -----------------------------

if (
    continueCard &&
    continueTitle &&
    continueTime &&
    continueBtn
) {

    const savedTitle = localStorage.getItem("storyTitle");
    const savedTime = localStorage.getItem("storyTime");
    const savedIndex = localStorage.getItem("storyIndex");

    if (
        savedTitle &&
        savedTime &&
        savedIndex !== null
    ) {

        continueCard.style.display = "block";

        continueTitle.textContent = savedTitle;

        continueTime.textContent =
            "Resume from " + formatTime(Number(savedTime));

        continueBtn.addEventListener("click", () => {

            const audios =
                document.querySelectorAll(".audio-player");

            const audio =
                audios[Number(savedIndex)];

            if (!audio) return;

            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
            }

            currentAudio = audio;

            audio.currentTime = Number(savedTime);

            audio.play();

            const playBtn =
                audio.closest(".story-card")
                     .querySelector(".play-btn");

            playBtn.textContent = "⏸ Playing";

            audio.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        });

    }

}


// -----------------------------
// HOMEPAGE - RECENTLY PLAYED
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {

    const recentContainer =
        document.getElementById("recentStories");

    if (!recentContainer) return;

    const recentStories =
        JSON.parse(localStorage.getItem("recentStories")) || [];

    recentContainer.innerHTML = "";

    if (recentStories.length === 0) {

        recentContainer.innerHTML =
            "<p>No stories played yet.</p>";

        return;
    }

    recentStories.forEach(story => {

        const recentCard =
            document.createElement("a");

        recentCard.className = "recent-card";

        recentCard.href = story.page;

        recentCard.innerHTML = `
    <h3>▶ Continue Listening</h3>

    <h4>${story.title}</h4>

    <p>Resume from ${formatTime(story.time)}</p>
`;

        recentContainer.appendChild(recentCard);

    });

});

// =============================
// DARK / LIGHT MODE
// =============================

const themeToggle = document.getElementById("themeToggle");

// Apply saved theme
if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light-mode");

    if(themeToggle){
        themeToggle.textContent = "🌙 Dark Mode";
    }

}else{

    if(themeToggle){
        themeToggle.textContent = "☀️ Light Mode";
    }

}

// Toggle theme
if(themeToggle){

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if(document.body.classList.contains("light-mode")){

            localStorage.setItem("theme","light");

            themeToggle.textContent = "🌙 Dark Mode";

        }else{

            localStorage.setItem("theme","dark");

            themeToggle.textContent = "☀️ Light Mode";

        }

    });

}
