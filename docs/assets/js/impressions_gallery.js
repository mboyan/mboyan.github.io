const projNames = ["proj_tree", "proj_diplo", "proj_pavilion", "proj_waam", "proj_aef"];

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

// Initializing the canvas
function initGallery()
{
    let canvasGallery = document.getElementById("canvas-gallery");
    let ctxGallery = canvasGallery.getContext("2d");
    let galleryImages = document.getElementsByClassName("gallery-image")
    let galleryImgA = galleryImages[focusIdxA];
    let galleryImgB = galleryImages[focusIdxB];

    if (!galleryImgA.complete || galleryImgA.naturalWidth === 0 || !galleryImgB.complete || galleryImgB.naturalWidth === 0 ) return;

    const galleryStyle = getComputedStyle(canvasGallery);
    canvasGallery.width = parseFloat(galleryStyle.width);
    canvasGallery.height = parseFloat(galleryStyle.height);

    drawPImg(ctxGallery, canvasGallery, galleryImgA, 1, true, galleryImgB);

    // Add swipe listener
    canvasGallery.addEventListener ('touchstart', function (event) {
        if (!touchOn) {
            initialTouchX = event.touches[0].clientX;
            initialTouchY = event.touches[0].clientY;
            touchOn = true;
        }
    });
    canvasGallery.addEventListener ('touchend', function (event) {
        if (touchOn) {
            finalTouchX = event.changedTouches[0].clientX;
            finalTouchY = event.changedTouches[0].clientY;
            touchOn = false;

            handleTouch(initialTouchX, finalTouchX, swipeLeft, swipeRight);
        }
    });
}

// Change project in gallery
function changeFocusIndex(increment)
{
    focusIdxA = focusIdxB;
    focusIdxB = (focusIdxB + increment + projNames.length) % projNames.length;
    initGallery();
}

var swipeLeft = () => {
    changeFocusIndex(1);
};

var swipeRight = () => {
    changeFocusIndex(-1);
};

// Navigate to project page
function navToProj()
{
    loadPage("proj", true, projNames[focusIdxB]);
}