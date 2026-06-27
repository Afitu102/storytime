<script>

let currentAudio = null;

 const continueCard = document.getElementById("continueCard");
const continueTitle = document.getElementById("continueTitle");
const continueTime = document.getElementById("continueTime");
const continueBtn = document.getElementById("continueBtn");

let savedAudio = null;
let savedCard = null;

function formatTime(seconds){
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if(secs < 10){
        secs = "0" + secs;
    }

    return mins + ":" + secs;
}   
document.querySelectorAll(".story-card").forEach(card => {

    const audio = card.querySelector(".audio-player");
    const playBtn = card.querySelector(".play-btn");
    const pauseBtn = card.querySelector(".pause-btn");
    const timeDisplay = card.querySelector(".time");

    playBtn.addEventListener("click", () => {

        if(currentAudio && currentAudio !== audio){

            currentAudio.pause();

            document.querySelectorAll(".play-btn")
            .forEach(btn => {
                btn.textContent = "▶ Play";
            });

        }

        audio.play();

        currentAudio = audio;

        playBtn.textContent = "⏸ Playing";

    });

    pauseBtn.addEventListener("click", () => {

        audio.pause();

        playBtn.textContent = "▶ Play";

    });

    audio.addEventListener("timeupdate", () => {

        timeDisplay.textContent =
        formatTime(audio.currentTime);
      localStorage.setItem("storyTitle",
    card.querySelector("h2").textContent);

localStorage.setItem("storyTime",
    audio.currentTime);

localStorage.setItem("storyIndex",
    [...document.querySelectorAll(".audio-player")].indexOf(audio));
        
    });

    audio.addEventListener("ended", () => {

        playBtn.textContent = "▶ Play";

    });

});

const savedTitle = localStorage.getItem("storyTitle");
const savedTime = localStorage.getItem("storyTime");
const savedIndex = localStorage.getItem("storyIndex");

if(savedTitle && savedTime && savedIndex !== null){

    continueCard.style.display = "block";

    continueTitle.textContent = savedTitle;

    continueTime.textContent =
        "Resume from " + formatTime(Number(savedTime));

    continueBtn.addEventListener("click", () => {

        const audios =
            document.querySelectorAll(".audio-player");

        const audio =
            audios[Number(savedIndex)];

        if(audio){

            if(currentAudio && currentAudio !== audio){
                currentAudio.pause();
            }

            currentAudio = audio;

            audio.currentTime = Number(savedTime);

            audio.play();

            audio.closest(".story-card")
                 .querySelector(".play-btn")
                 .textContent = "⏸ Playing";

            audio.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    });

}   
</script>
