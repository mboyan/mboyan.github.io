// Initializing the canvas
let canvasLogo = document.getElementById("canvas-logo");
let ctxLogo = canvasLogo.getContext("2d");
let logo = document.getElementById("logo");

// Circular boundary
let bndry = {
    midX: 250,
    midY: 150,
    rad: 45
}

let targetHeaderHeight = 300;
// let transitionCt = 0;

let suspendAnim = false;

document.getElementById("button-home").addEventListener("click", headerTransitionHome);
document.getElementById("button-bio").addEventListener("click", headerTransitionBio);
document.getElementById("button-proj").addEventListener("click", headerTransitionProj);
document.getElementById("button-sols").addEventListener("click", headerTransitionSols);
document.getElementById("button-contact").addEventListener("click", headerTransitionContact);

function changeHeaderHeight()
{
    let currHeight = canvasLogo.height;
    console.log(ctxLogo.globalAlpha);
    let alpha = ctxLogo.globalAlpha * 0.9;
    
    // if (currHeight < targetHeaderHeight) {
    // transitionCt++;
    currHeight = currHeight + (targetHeaderHeight - currHeight) * 0.1;
    ctxLogo.globalAlpha = alpha;
    console.log(ctxLogo.globalAlpha);
    // console.log(transitionCt);
    // console.log("Target height:");
    // console.log(targetHeaderHeight);
    // console.log("Current height:");
    // console.log(currHeight);
    document.getElementById("page-header").height = (currHeight + 110) + "px";
    canvasLogo.style.height = currHeight;
    canvasLogo.height = currHeight;
    // }
}

function updateHeader(newBndryMidX, newBndryMidY)
{
    clearInterval(transitionInterval);

    document.getElementById("page-header").height = (targetHeaderHeight + 110) + "px";
    canvasLogo.style.height = targetHeaderHeight;
    canvasLogo.height = targetHeaderHeight;

    bndry.midX = newBndryMidX;
    bndry.midY = newBndryMidY;
    genLogoInterval = setInterval(drawGenLogo1, 1);
}

function headerTransitionHome()
{
    clearInterval(genLogoInterval);
    
    targetHeaderHeight = 300;
    transitionInterval = setInterval(changeHeaderHeight, 10);
    setTimeout(updateHeader, 500, 250, 150);
    
    logo = document.getElementById("logo");
}

function headerTransitionBio()
{
    clearInterval(genLogoInterval);

    targetHeaderHeight = 100;
    transitionInterval = setInterval(changeHeaderHeight, 10);
    setTimeout(updateHeader, 500, 50, 50);

    logo = document.getElementById("header-bio");
}

function headerTransitionProj()
{
    clearInterval(genLogoInterval);
    
    targetHeaderHeight = 100;
    transitionInterval = setInterval(changeHeaderHeight, 10);
    setTimeout(updateHeader, 500, 50, 50);

    logo = document.getElementById("header-proj");
}

function headerTransitionSols()
{
    clearInterval(genLogoInterval);

    targetHeaderHeight = 100;
    transitionInterval = setInterval(changeHeaderHeight, 10);
    setTimeout(updateHeader, 500, 50, 50);

    logo = document.getElementById("header-sols");
}

function headerTransitionContact()
{
    // clearInterval(genLogoInterval);

    targetHeaderHeight = 100;
    transitionInterval = setInterval(changeHeaderHeight, 10);
    setTimeout(updateHeader, 500, 50, 50);

    logo = document.getElementById("header-contact");
}