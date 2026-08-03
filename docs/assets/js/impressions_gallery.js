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

let galleryRetryCount = 0;
const galleryRetryLimit = 200;

// Initializing the gallery canvas
function initGallery() {
    const canvasGallery = document.getElementById("canvas-gallery");
    const ctxGallery = canvasGallery.getContext("2d");
    const galleryImages = document.getElementsByClassName("gallery-image");
    const galleryImgA = galleryImages[focusIdxA];
    const galleryImgB = galleryImages[focusIdxB];
    console.log(galleryImgA);
    console.log(galleryImgB);

    if (!galleryImgA || !galleryImgB ||
        !galleryImgA.complete || galleryImgA.naturalWidth === 0 ||
        !galleryImgB.complete || galleryImgB.naturalWidth === 0) {

        if (galleryRetryCount < galleryRetryLimit) {
            galleryRetryCount += 1;
            window.setTimeout(initGallery, 100);
        }
        return;
    }

    galleryRetryCount = 0;

    const galleryStyle = getComputedStyle(canvasGallery);
    // canvasGallery.width = canvasGallery.clientWidth || parseFloat(galleryStyle.width);
    // canvasGallery.height = canvasGallery.clientHeight || galleryWidth;
    canvasGallery.width = parseFloat(galleryStyle.width);
    canvasGallery.height = parseFloat(galleryStyle.height);

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
    focusIdxB = (focusIdxB + increment + projNames.length) % projNames.length;

    // if (xFadeFuncInterval) {
    //     clearInterval(xFadeFuncInterval);
    //     xFadeFuncInterval = null;
    // }

    // xFadeStepCt = 0;
    initGallery();
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