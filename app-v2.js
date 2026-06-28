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
