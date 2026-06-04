const projNames = ["proj_tree", "proj_diplo", "proj_pavilion", "proj_waam", "proj_aef"];

let focusIdxA = 0;
let focusIdxB = 0;

// Initializing the canvas
function initGallery()
{
    let canvasGallery = document.getElementById("canvas-gallery");
    let ctxGallery = canvasGallery.getContext("2d");
    let galleryImages = document.getElementsByClassName("gallery-image")
    let galleryImgA = galleryImages[focusIdxA];
    let galleryImgB = galleryImages[focusIdxB];

    if (!galleryImgA.complete || galleryImgA.naturalWidth === 0 || !galleryImgB.complete || galleryImgB.naturalWidth === 0 ) return;

    canvasGallery.width = 480;
    canvasGallery.height = 480;

    drawPImg(ctxGallery, canvasGallery, galleryImgA, 1, true, galleryImgB);
}

// Change project in gallery
function changeFocusIndex(increment)
{
    focusIdxA = focusIdxB;
    focusIdxB = (focusIdxB + increment + projNames.length) % projNames.length;
    initGallery();
}

// Navigate to project page
function navToProj()
{
    loadPage("proj", true, projNames[focusIdxB]);
}