// Initializing the canvas
let canvasImg = document.getElementById("canvas-img");
let ctxImg = canvasImg.getContext("2d");
let img = document.getElementById("patterned_img");
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

function drawPImg()
{
    let scaledHeight = img.height * canvasImg.width / img.width;
    ctxImg.clearRect(0, 0, canvasImg.width, scaledHeight);
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
            let red, green, blue;
            let idx = j * 12 * stride * canvasImg.width + i * 12 * stride;
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
    if (!img.complete || img.naturalWidth === 0) return;

    const maxWidth = 2560;
    canvasImg.width = Math.min(window.innerWidth, maxWidth);

    const aspectRatio = img.naturalHeight / img.naturalWidth;
    canvasImg.height = canvasImg.width * aspectRatio; // Maintain aspect ratio

    const contentHeight = document.querySelector('.overlay-text-container').offsetHeight;

    if (canvasImg.width === 0 || canvasImg.height === 0) return;

    // Calculate free space between content and bottom of the viewport
    const freeSpace = canvasImg.height - contentHeight;
    console.log(freeSpace);

    if (freeSpace > 0) {
        document.querySelector('.spacer').style.minHeight = `${freeSpace}px`; // Adjust spacer height
    } else {
        document.querySelector('.spacer').style.minHeight = '0'; // Reset spacer if there's no free space
    }

    drawPImg();
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