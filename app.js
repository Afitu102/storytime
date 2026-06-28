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

function saveRecentStory(card){

    const title = card.querySelector("h2").textContent;

    const category = card.dataset.category;

    const page = card.dataset.page;

    let recentStories =
        JSON.parse(localStorage.getItem("recentStories")) || [];

    recentStories =
        recentStories.filter(story => story.title !== title);

    recentStories.unshift({

        title,

        category,

        page

    });

    recentStories = recentStories.slice(0,10);

    localStorage.setItem(
        "recentStories",
        JSON.stringify(recentStories)
    );

}
