const projImgDir = "./assets/img/projects/";
const projImages = ["awwp_06.JPG", "diplo_01.JPG", "pavilion_04.jpg"];

let focusIdx = 0;

// Initializing the canvas
let canvasGallery = document.getElementById("canvas-gallery");
let ctxGallery = canvasGallery.getContext("2d");
let galleryLeftImg = document.getElementById("impressions-left");
let galleryCenterImg = document.getElementById("impressions-center");
let galleryRightImg = document.getElementById("impressions-right");