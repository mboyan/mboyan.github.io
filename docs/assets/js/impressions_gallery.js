const projNames = ["proj_tree", "proj_diplo", "proj_pavilion", "proj_waam", "proj_aef"];
const nGalleryProjects = projNames.length;

let focusIdxA = 0;
let focusIdxB = 0;

// Gallery swiping on mobile device
var initialTouchX, initialTouchY, finalTouchX, finalTouchY;
var swipeThreshold = 100;
var touchOn = false;

function handleTouch(startX, endX, onSwipeLeft, onSwipeRight) {
    var horizontalDistance = finalTouchX - initialTouchX;
    var verticalDistance = finalTouchY - initialTouchY;

    if (Math.abs(horizontalDistance) > Math.abs(verticalDistance) &&
      Math.abs(horizontalDistance) > swipeThreshold) {
        if (horizontalDistance < 0) {
            onSwipeLeft(); 
        } else {
            onSwipeRight();
        }
    }
}

let canvasGallery = null;
let ctxGallery = null;
let galleryImages = null;
let galleryImgA = null;
let galleryImgB = null;
let galleryRetryCount = 0;
const galleryRetryLimit = 200;

// Initializing the gallery canvas
function initGallery() {
    canvasGallery = document.getElementById("canvas-gallery");
    ctxGallery = canvasGallery.getContext("2d");
    galleryImages = document.getElementsByClassName("gallery-image");
    
    refreshGallery()
}

function refreshGallery() {
    galleryImgA = galleryImages[focusIdxA];
    galleryImgB = galleryImages[focusIdxB];

    // document.getElementById("debug").textContent = "Changed focus index to " + focusIdxB + ": " + galleryImgB.src + " with width " + galleryImgB.naturalWidth + ", attempt " + galleryRetryCount;
    // console.log(galleryImgB.naturalWidth);

    if (!galleryImgA || !galleryImgB ||
        !galleryImgA.complete || galleryImgA.naturalWidth === 0 ||
        !galleryImgB.complete || galleryImgB.naturalWidth === 0) {

        if (galleryRetryCount < galleryRetryLimit) {
            galleryRetryCount += 1;
            window.setTimeout(refreshGallery, 100);
        }
        return;
    }

    galleryRetryCount = 0;

    const galleryStyle = getComputedStyle(canvasGallery);
    // canvasGallery.width = canvasGallery.clientWidth || parseFloat(galleryStyle.width);
    // canvasGallery.height = canvasGallery.clientHeight || galleryWidth;
    canvasGallery.width = parseFloat(galleryStyle.width);
    canvasGallery.height = parseFloat(galleryStyle.height);

    // document.getElementById("debug").textContent = galleryImgB.src;

    drawPImg(ctxGallery, canvasGallery, galleryImgA, 1, true, galleryImgB);

    if (!canvasGallery.dataset.swipeListenersBound) {
        canvasGallery.addEventListener("touchstart", function (event) {
            if (!touchOn) {
                initialTouchX = event.touches[0].clientX;
                initialTouchY = event.touches[0].clientY;
                touchOn = true;
            }
        });

        canvasGallery.addEventListener("touchend", function (event) {
            if (touchOn) {
                finalTouchX = event.changedTouches[0].clientX;
                finalTouchY = event.changedTouches[0].clientY;
                touchOn = false;

                handleTouch(initialTouchX, finalTouchX, swipeLeft, swipeRight);
            }
        });

        canvasGallery.dataset.swipeListenersBound = "true";
    }
}

// Change project in gallery
function changeFocusIndex(increment)
{
    focusIdxA = focusIdxB;
    focusIdxB = (focusIdxB + increment + nGalleryProjects) % nGalleryProjects;

    // if (xFadeFuncInterval) {
    //     clearInterval(xFadeFuncInterval);
    //     xFadeFuncInterval = null;
    // }

    // xFadeStepCt = 0;
    refreshGallery();
}

var swipeLeft = () => {
    // changeFocusIndex(1);
};

var swipeRight = () => {
    // changeFocusIndex(-1);
};

// Navigate to project page
function navToProj()
{
    loadPage("proj", true, projNames[focusIdxB]);
}