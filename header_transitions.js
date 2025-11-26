// // Initializing the canvas
// let canvasLogo = document.getElementById("canvas-logo");
// let ctxLogo = canvasLogo.getContext("2d");
// let logo = document.getElementById("logo");

// // Circular boundary
// let bndry = {
//     midX: 250,
//     midY: 150,
//     rad: 45
// }

// let currHeight = 300;
// let targetHeight = 300;
// let newBndryMidX = 50;
// let newBndryMidY = 50;
// let targetLogo = document.getElementById("logo");
// // let transitionCt = 0;

// let suspendAnim = false;

// document.getElementById("button-home").addEventListener("click", headerTransitionHome);
// document.getElementById("button-bio").addEventListener("click", headerTransitionBio);
// document.getElementById("button-proj").addEventListener("click", headerTransitionProj);
// document.getElementById("button-sols").addEventListener("click", headerTransitionSols);
// document.getElementById("button-contact").addEventListener("click", headerTransitionContact);

// function changeHeaderHeight()
// {
//     let realHeight = canvasLogo.clientHeight;
//     currHeight = realHeight + (targetHeight - currHeight) * 0.1;
//     document.getElementById("page-header").style.height = (currHeight + 110) + "px";
//     canvasLogo.style.height = currHeight + "px";
//     // canvasLogo.height = Math.round(currHeight);

//     // console.log("diff: " + Math.abs(currHeight - targetHeight));
//     if (Math.abs(currHeight - targetHeight) < 5){
//         clearInterval(transitionInterval);
//         updateHeader();
//     }
// }

// function updateHeader()
// {
//     document.getElementById("page-header").style.height = (targetHeight + 110) + "px";
//     canvasLogo.style.height = targetHeight + "px";
//     // canvasLogo.height = targetHeight;
//     // ctxLogo.setTransform(
//     //     canvasLogo.clientWidth / canvasLogo.width,
//     //     0,
//     //     0,
//     //     canvasLogo.clientHeight / canvasLogo.height,
//     //     0,
//     //     0
//     // );


//     bndry.midX = newBndryMidX;
//     bndry.midY = newBndryMidY;
//     logo = targetLogo;
//     genLogoInterval = setInterval(drawGenLogo1, 1);
//     // console.log("updating header");
// }

// function headerTransitionHome()
// {
//     // console.log("clearing logo");
//     clearInterval(genLogoInterval);
//     ctxLogo.clearRect(0, 0, canvasLogo.width, canvasLogo.height);
    
//     targetHeight = 300;
//     newBndryMidX = 250;
//     newBndryMidY = 150;
//     transitionInterval = setInterval(changeHeaderHeight, 10);
    
//     targetLogo = document.getElementById("logo");
// }

// function headerTransitionBio()
// {
//     clearInterval(genLogoInterval);
//     ctxLogo.clearRect(0, 0, canvasLogo.width, canvasLogo.height);

//     targetHeight = 100;
//     newBndryMidX = 50;
//     newBndryMidY = 50;
//     transitionInterval = setInterval(changeHeaderHeight, 10);

//     targetLogo = document.getElementById("header-bio");
// }

// function headerTransitionProj()
// {
//     clearInterval(genLogoInterval);
//     ctxLogo.clearRect(0, 0, canvasLogo.width, canvasLogo.height);
    
//     targetHeight = 100;
//     newBndryMidX = 50;
//     newBndryMidY = 50;
//     transitionInterval = setInterval(changeHeaderHeight, 10);

//     targetLogo = document.getElementById("header-proj");
// }

// function headerTransitionSols()
// {
//     clearInterval(genLogoInterval);
//     ctxLogo.clearRect(0, 0, canvasLogo.width, canvasLogo.height);

//     targetHeight = 100;
//     newBndryMidX = 50;
//     newBndryMidY = 50;
//     transitionInterval = setInterval(changeHeaderHeight, 10);

//     targetLogo = document.getElementById("header-sols");
// }

// function headerTransitionContact()
// {
//     clearInterval(genLogoInterval);
//     ctxLogo.clearRect(0, 0, canvasLogo.width, canvasLogo.height);

//     targetHeight = 100;
//     newBndryMidX = 50;
//     newBndryMidY = 50;
//     transitionInterval = setInterval(changeHeaderHeight, 10);

//     targetLogo = document.getElementById("header-contact");
// }

// --------------------------------------------
// INITIAL SETUP
// --------------------------------------------
let canvasLogo = document.getElementById("canvas-logo");
let ctxLogo = canvasLogo.getContext("2d");
let logo = document.getElementById("logo");

// Circular boundary object
let bndry = {
    midX: 250,
    midY: 150,
    rad: 45
};

let currHeight = 300;
let targetHeight = 300;
let newBndryMidX = 250;
let newBndryMidY = 150;
let targetLogo = document.getElementById("logo");

let animating = false;
let rafId = null;       // requestAnimationFrame ID
let genLogoInterval = null;  // Logo drawing loop ID


// --------------------------------------------
// EVENT LISTENERS
// --------------------------------------------
document.getElementById("button-home").addEventListener("click", headerTransitionHome);
document.getElementById("button-bio").addEventListener("click", headerTransitionBio);
document.getElementById("button-proj").addEventListener("click", headerTransitionProj);
document.getElementById("button-sols").addEventListener("click", headerTransitionSols);
document.getElementById("button-contact").addEventListener("click", headerTransitionContact);


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
    newBndryMidX = 250;
    newBndryMidY = 150;
    targetHeight = 300;
    targetLogo = document.getElementById("logo");
    startTransition();
}

function headerTransitionBio() {
    newBndryMidX = 50;
    newBndryMidY = 50;
    targetHeight = 100;
    targetLogo = document.getElementById("header-bio");
    startTransition();
}

function headerTransitionProj() {
    newBndryMidX = 50;
    newBndryMidY = 50;
    targetHeight = 100;
    targetLogo = document.getElementById("header-proj");
    startTransition();
}

function headerTransitionSols() {
    newBndryMidX = 50;
    newBndryMidY = 50;
    targetHeight = 100;
    targetLogo = document.getElementById("header-sols");
    startTransition();
}

function headerTransitionContact() {
    newBndryMidX = 50;
    newBndryMidY = 50;
    targetHeight = 100;
    targetLogo = document.getElementById("header-contact");
    startTransition();
}
