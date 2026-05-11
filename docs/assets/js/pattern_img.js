// Initializing the canvas
let canvasImg = document.getElementById("canvas-bkg");
let ctxImg = canvasImg.getContext("2d");
let img = document.getElementById("patterned-img");
var strideFuncInterval = null;

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

function drawPImg(ctxt, canv, inputImg, strideSize, cropToSquare = false)
{
    const canvWidth = canv.clientWidth;
    const canvHeight = canv.clientHeight;
    // const minDim = Math.min(canvWidth, canvHeight);
    // let scaledHeight = (cropToSquare ? canvWidth : inputImg.height * canvWidth / inputImg.width);
    const imgAspectRatio = inputImg.naturalHeight / inputImg.naturalWidth;
    let scaledWidth = canvWidth / imgAspectRatio;
    let scaledHeight = imgAspectRatio * canvWidth;
    
    ctxt.clearRect(0, 0, canvWidth, scaledHeight);
    if (cropToSquare) {
        if (imgAspectRatio < 1.0) {
            let excessX = Math.min(canvWidth - scaledWidth, 0.0) * 0.5;
            ctxt.drawImage(inputImg, excessX, 0, scaledWidth, canvHeight);
        } else {
            let excessY = Math.min(canvHeight - scaledHeight, 0.0) * 0.5;
            ctxt.drawImage(inputImg, 0, excessY, canvWidth, scaledHeight);
        }
    } else {
        ctxt.drawImage(inputImg, 0, 0, canvWidth, scaledHeight);
    }

    const imgData = ctxt.getImageData(0, 0, canvWidth, canvHeight);
    const imgColData = imgData.data;
    const patData = ctxt.createImageData(canvWidth, canvHeight);
    const patColData = patData.data;
    let roughWidth = Math.floor(canvWidth / (3 * strideSize));
    let roughHeight = Math.floor(canvHeight / (3 * strideSize));

    // Crop source image to a square
    if (cropToSquare) {
        console.log(roughWidth);
        console.log(roughHeight);
        // console.log(canvWidth);
        // console.log(canvHeight);
        // console.log(scaledHeight);
        // console.log(imgColData.length);
        // console.log(patColData.length);
    }

    // Fill default color
    for (let i = 0; i < patColData.length; i += 4){
        patColData[i] = 248;
        patColData[i + 1] = 249;
        patColData[i + 2] = 250;
        patColData[i + 3] = 0;
    }

    // Create halftone pattern
    for (let i = 0; i < roughWidth; i++)
    {
        for (let j = 0; j < roughHeight; j++)
        {
            let red, green, blue;
            let idx = j * 12 * strideSize * canvWidth + i * 12 * strideSize;
            red = imgColData[idx];
            green = imgColData[idx + 1];
            blue = imgColData[idx + 2];

            let stencilIndices = redStencil.slice(0, Math.ceil(red / 64));
            stencilIndices = stencilIndices.concat(greenStencil.slice(0, Math.ceil(green / 64)));
            stencilIndices = stencilIndices.concat(blueStencil.slice(0, Math.ceil(blue / 64)));
            
            for (let k = 0; k < 3; k++){
                for (let p = 0; p < 3; p++){
                    let testIdx = k*3 + p;
                    if (!stencilIndices.includes(testIdx)){
                        for (let m = 0; m < strideSize; m++) {
                            for (let n = 0; n < strideSize; n++) {
                                let patIdx = (j*3*strideSize + k*strideSize + m) * (canvWidth * 4) + (i*3*strideSize + p*strideSize + n) * 4;
                                patColData[patIdx] = 73;
                                patColData[patIdx + 1] = 80;
                                patColData[patIdx + 2] = 87;
                                patColData[patIdx + 3] = 255;
                            }
                        }
                    }
                }
            }
        }
    }

    ctxt.putImageData(patData, 0, 0);
}

function resizeCanvas()
{
    if (!img.complete || img.naturalWidth === 0) return;

    const maxWidth = 2560;
    canvasImg.width = Math.min(window.innerWidth, maxWidth);

    const aspectRatio = img.naturalHeight / img.naturalWidth;
    canvasImg.height = canvasImg.width * aspectRatio; // Maintain aspect ratio

    const contentHeight = document.querySelector('.overlay-text-container').offsetHeight;

    if (canvasImg.width === 0 || canvasImg.height === 0) return;

    // Calculate free space between content and bottom of the viewport
    const freeSpace = canvasImg.height - contentHeight;

    if (freeSpace > 0) {
        document.querySelector('.spacer').style.minHeight = `${freeSpace}px`; // Adjust spacer height
    } else {
        document.querySelector('.spacer').style.minHeight = '0'; // Reset spacer if there's no free space
    }

    drawPImg(ctxImg, canvasImg, img, stride);
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

function resetImg(imgSrc)
{
    if (img != null) {
        img.src = imgSrc;
    }
    initImg();
}

img.onload = () => {
    initImg();
}

window.addEventListener('resize', resizeCanvas);