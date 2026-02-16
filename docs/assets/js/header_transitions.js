// --------------------------------------------
// INITIAL SETUP
// --------------------------------------------
let canvasLogo = document.getElementById("canvas-logo");
let ctxLogo = canvasLogo.getContext("2d");
let logo = document.getElementById("logo");

const isMobile = window.matchMedia("(max-width: 500px)").matches;

// Circular boundary object
let bndry;

if (!isMobile){
    bndry = {
        midX: 250,
        midY: 150,
        rad: 45
    };
} else {
    bndry = {
        midX: 160,
        midY: 96,
        rad: 29
    };
}

let currHeight = isMobile ? 192 : 300;
let targetHeight = isMobile ? 192 : 300;
let newBndryMidX = isMobile ? 160 : 250;
let newBndryMidY = isMobile ? 96 : 150;
let targetLogo = document.getElementById("logo");

let animating = false;
let rafId = null;       // requestAnimationFrame ID
let genLogoInterval = null;  // Logo drawing loop ID


// --------------------------------------------
// EVENT LISTENERS
// --------------------------------------------
// document.getElementById("button-home").addEventListener("click", headerTransitionHome);
// document.getElementById("button-bio").addEventListener("click", headerTransitionBio);
// document.getElementById("button-proj").addEventListener("click", headerTransitionProj);
// document.getElementById("button-sols").addEventListener("click", headerTransitionSols);
// document.getElementById("button-contact").addEventListener("click", headerTransitionContact);


// --------------------------------------------
// SMOOTH ANIMATION LOOP
// --------------------------------------------
function animateHeight() {

    // Smooth step toward target
    currHeight += (targetHeight - currHeight) * 0.15;

    // Apply heights
    canvasLogo.style.height = currHeight + "px";
    document.getElementById("page-header").style.height = (currHeight + 110) + "px";

    // Stop condition: close enough
    if (Math.abs(currHeight - targetHeight) < 1) {
        finalizeHeight();
        animating = false;
        return;
    }

    rafId = requestAnimationFrame(animateHeight);
}

function finalizeHeight() {

    canvasLogo.style.height = targetHeight + "px";
    canvasLogo.height = targetHeight;     // safe now, after animation
    document.getElementById("page-header").style.height =
        (targetHeight + 110) + "px";

    // Now safe to update logo and boundary
    bndry.midX = newBndryMidX;
    bndry.midY = newBndryMidY;

    logo = targetLogo;

    // Restart logo animation
    ctxLogo.clearRect(0, 0, canvasLogo.width, canvasLogo.height);
    frameCt = 0;
    pSystem = new ParticleSystem(nParticles, bndry, 1.0, 0.9, 0.00, 8., baseSmoothing);
    genLogoInterval = setInterval(drawGenLogo1, 1);
}

function startTransition() {
    cancelAnimationFrame(rafId);
    clearInterval(genLogoInterval);

    // Ensure pixel buffer matches CSS size
    canvasLogo.width = canvasLogo.clientWidth;
    canvasLogo.height = canvasLogo.clientHeight;

    // Clear canvas completely
    ctxLogo.clearRect(0, 0, canvasLogo.width, canvasLogo.height);

    if (!animating) {
        animating = true;
        rafId = requestAnimationFrame(animateHeight);
    }
}


// --------------------------------------------
// BUTTON HANDLERS
// --------------------------------------------
function headerTransitionHome() {
    newBndryMidX = isMobile ? 160 : 250;
    newBndryMidY = isMobile ? 96 : 150;
    targetHeight = isMobile ? 192 : 300;
    targetLogo = document.getElementById("logo");
    startTransition();
}

function headerTransitionBio() {
    newBndryMidX = isMobile ? 32 : 50;
    newBndryMidY = isMobile ? 32 : 50;
    targetHeight = isMobile ? 64 : 100;
    targetLogo = document.getElementById("header-bio");
    startTransition();
}

function headerTransitionProj() {
    newBndryMidX = isMobile ? 32 : 50;
    newBndryMidY = isMobile ? 32 : 50;
    targetHeight = isMobile ? 64 : 100;
    targetLogo = document.getElementById("header-proj");
    startTransition();
}

function headerTransitionSols() {
    newBndryMidX = isMobile ? 32 : 50;
    newBndryMidY = isMobile ? 32 : 50;
    targetHeight = isMobile ? 64 : 100;
    targetLogo = document.getElementById("header-sols");
    startTransition();
}

function headerTransitionContact() {
    newBndryMidX = isMobile ? 32 : 50;
    newBndryMidY = isMobile ? 32 : 50;
    targetHeight = isMobile ? 64 : 100;
    targetLogo = document.getElementById("header-contact");
    startTransition();
}

// Change of URL
let headerFunctions = {
    'home.htm': headerTransitionHome,
    'bio.htm': headerTransitionBio,
    'proj.htm': headerTransitionProj,
    'sols.htm': headerTransitionSols,
    'contact.htm': headerTransitionContact
}

window.addEventListener('popstate', () => {
    const currentUrl = window.location.href;
    var page = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    // console.log(page);

    if (page in headerFunctions){

        // Trigger transition
        headerFunctions[page]();
    }
});