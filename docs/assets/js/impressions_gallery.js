const projImgDir = "./assets/img/projects/";
const projImages = ["awwp_06.JPG", "diplo_01.JPG", "pavilion_04.jpg"];

let focusIdx = 0;

// Initializing the canvas
function initGallery()
{
    let canvasGallery = document.getElementById("canvas-gallery");
    // console.log(canvasGallery);
    let ctxGallery = canvasGallery.getContext("2d");
    let galleryImages = document.getElementsByClassName("gallery-image")
    let galleryImg = galleryImages[focusIdx];

    if (!galleryImg.complete || galleryImg.naturalWidth === 0) return;

    canvasGallery.width = 480;
    canvasGallery.height = 480;

    // const aspectRatio = galleryImg.naturalHeight / galleryImg.naturalWidth;
    // canvasGallery.height = canvasGallery.width * aspectRatio; // Maintain aspect ratio

    drawPImg(ctxGallery, canvasGallery, galleryImg, 1, true);
}

function changeFocusIndex(increment)
{
    focusIdx = (focusIdx + increment + projImages.length) % projImages.length;
    initGallery();
}