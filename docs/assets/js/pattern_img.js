// Initializing the canvas
let canvasImg = document.getElementById("canvas-img");
let ctxImg = canvasImg.getContext("2d");
const img = document.getElementsByClassName("patterned_img")[0];
var strideFuncInterval = null;

// ctxImg.imageSmoothingEnabled = false;

// ctxImg.drawImage(img, 0, 0, canvasImg.width, img.height);

// Create 3x3 stencil
let stencil = [];
for (let i = 0; i < 3; i++){
    for (let j = 0; j < 3; j++){
        stencil[i*3 + j] = [i, j];
    }
}

let redStencil = [0, 4, 8];
let greenStencil = [6, 5, 2];
let blueStencil = [3, 1, 7];

let stride = 1;

function drawPImg()
{
    let scaledHeight = img.height * canvasImg.width / img.width;
    ctxImg.clearRect(img, 0, 0, canvasImg.width, scaledHeight);
    ctxImg.drawImage(img, 0, 0, canvasImg.width, scaledHeight);

    const imgData = ctxImg.getImageData(0, 0, canvasImg.width, canvasImg.height);
    const imgColData = imgData.data;
    const patData = ctxImg.createImageData(canvasImg.width, canvasImg.height);
    const patColData = patData.data;
    let roughWidth = Math.floor(canvasImg.width / (3 * stride));
    let roughHeight = Math.floor(canvasImg.height / (3 * stride));

    // Fill default color
    for (let i = 0; i < patColData.length; i += 4){
        patColData[i] = 248;
        patColData[i + 1] = 249;
        patColData[i + 2] = 250;
        patColData[i + 3] = 255;
    }

    // Create halftone pattern
    for (let i = 0; i < roughWidth; i++)
    {
        for (let j = 0; j < roughHeight; j++)
        {
            let idx = j * 12 * stride * canvasImg.width + i * 12 * stride;
            let red = imgColData[idx];
            let green = imgColData[idx + 1];
            let blue = imgColData[idx + 2];

            let stencilIndices = redStencil.slice(0, Math.ceil(red / 64));
            stencilIndices = stencilIndices.concat(greenStencil.slice(0, Math.ceil(green / 64)));
            stencilIndices = stencilIndices.concat(blueStencil.slice(0, Math.ceil(blue / 64)));
            
            for (let k = 0; k < 3; k++){
                for (let p = 0; p < 3; p++){
                    let testIdx = k*3 + p;
                    if (!stencilIndices.includes(testIdx)){
                        for (let m = 0; m < stride; m++) {
                            for (let n = 0; n < stride; n++) {
                                let patIdx = (j*3*stride + k*stride + m) * (canvasImg.width * 4) + (i*3*stride + p*stride + n) * 4;
                                patColData[patIdx] = 73;
                                patColData[patIdx + 1] = 80;
                                patColData[patIdx + 2] = 87;
                            }
                        }
                    }
                }
            }
        }
    }

    ctxImg.putImageData(patData, 0, 0);
}

function resizeCanvas()
{
    const maxWidth = 1200;
    canvasImg.width = Math.min(window.innerWidth, maxWidth);
    canvasImg.height = img.height * canvasImg.width / img.width;
    drawPImg();
    // console.log("Image drawn");
}

function shrinkStride()
{
    if (stride > 1) {
        stride -= 1;
        resizeCanvas();
    }
    else {
        stride = 1;
        clearInterval(strideFuncInterval);
    }
}

function initImg()
{
    if (strideFuncInterval) clearInterval(strideFuncInterval);
    resizeCanvas();
    stride = 10;
    strideFuncInterval = setInterval(shrinkStride, 10);
}

img.onload = () => {
    initImg();
    console.log("foo");
}

window.addEventListener('resize', resizeCanvas);
// initImg();
// resizeCanvas();