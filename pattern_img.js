// Initializing the canvas
let canvasImg = document.getElementById("canvas_img");
let ctxImg = canvasImg.getContext("2d");
const img = document.getElementsByClassName("patterned_img")[0];

// ctxImg.drawImage(img, 0, 0, canvasImg.width, img.height);

let redStencil = [[0, 0], [1, 1], [2, 2]];
let greenStencil = [[0, 2], [2, 1], [2, 0]];
let blueStencil = [[0, 1], [1, 0], [1, 2]];

let stride = 1;

// console.log(Math.ceil(120/64));
// let test = redStencil.slice(0, 2);
// test = test.concat(greenStencil.slice(0, 2));
// for (let i = 0; i < test.length; i++){
//     console.log(test);
// }


function drawPImg()
{
    let scaledHeight = img.height * canvasImg.width / img.width;
    ctxImg.clearRect(img, 0, 0, canvasImg.width, scaledHeight);
    ctxImg.drawImage(img, 0, 0, canvasImg.width, scaledHeight);

    const imgData = ctxImg.getImageData(0, 0, canvasImg.width, canvasImg.height);
    const imgColData = imgData.data;
    const patData = ctxImg.createImageData(canvasImg.width, canvasImg.height);
    const patColData = patData.data;
    let roughWidth = Math.ceil(canvasImg.width / (3 * stride));
    let roughHeight = Math.ceil(canvasImg.height / (3 * stride));

    // console.log(roughWidth);

    // Fill default color
    for (let i = 0; i < patColData.length; i += 4){
        patColData[i] = 73;
        patColData[i + 1] = 80;
        patColData[i + 2] = 87;
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

            // console.log(red);

            let addPix = redStencil.slice(0, Math.ceil(red / 64));
            addPix = addPix.concat(greenStencil.slice(0, Math.ceil(green / 64)));
            addPix = addPix.concat(blueStencil.slice(0, Math.ceil(blue / 64)));

            // if (red > 128) {
            //     let patIdx = j * 3 * canvasImg.width * 4 + i * 12;
            //     patColData[patIdx] = 0;
            //     patColData[patIdx + 1] = 0;
            //     patColData[patIdx + 2] = 0;
            // }

            // console.log(addPix.length);

            // let patIdx = j * 3 * canvasImg.width * 4 + i * 3 * 4;

            // patColData[idx] = 200;
            // patColData[patIdx] = 0;
            // patColData[patIdx + 1] = 0;
            // patColData[patIdx + 2] = 0;

            for (let k = 0; k < addPix.length; k++) {
                for (let m = 0; m < stride; m++) {
                    for (let n = 0; n < stride; n++) {
                        let patIdx = (j*3*stride + addPix[k][1]*stride + m) * (canvasImg.width * 4) + (i*3*stride + addPix[k][0]*stride + n) * 4;
                        patColData[patIdx] = 248;
                        patColData[patIdx + 1] = 249;
                        patColData[patIdx + 2] = 250;
                    }
                }
                // let patIdx = (j*3 + addPix[k][1]) * (canvasImg.width * 4) + (i*3 + addPix[k][0]) * 4;
                // patColData[patIdx] = 200;
                // patColData[patIdx + 1] = 200;
                // patColData[patIdx + 2] = 200;
            }
        }
    }
    // console.log(addPix.legnth);
    console.log("foo");

    ctxImg.putImageData(patData, 0, 0);
}

function resizeCanvas()
{
    canvasImg.width = window.innerWidth;
    canvasImg.height = img.height * window.innerWidth / img.width;
    drawPImg();
}

img.onload = resizeCanvas;
window.addEventListener('resize', resizeCanvas);
resizeCanvas();