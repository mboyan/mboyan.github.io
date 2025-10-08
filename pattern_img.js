// Initializing the canvas
let canvasImg = document.getElementById("canvas_img");
let ctxImg = canvasImg.getContext("2d");
const img = document.getElementsByClassName("patterned_img")[0];
img.onload = () => {
  ctxImg.drawImage(img, 0, 0, canvas.width, canvas.height);
};

ctxImg.drawImage(img, 0, 0, canvas.width, canvas.height);

const imgData = ctxImg.getImageData(0, 0, canvasImg.width, canvasImg.height);
const imgColData = imgData.data;
const patData = ctxImg.createImageData(canvasImg.width, canvasImg.height);
const patColData = patData.data;
let roughWidth = Math.ceil(canvasImg.width / 3);
let roughHeight = Math.ceil(canvasImg.height / 3);

let redStencil = [[0, 0], [1, 1], [2, 2]];
let greenStencil = [[0, 2], [2, 1], [2, 0]];
let blueStencil = [[0, 1], [1, 0], [1, 2]];

// Fill default color
for (let i = 0; i < patColData.length; i++){
    patColData[i] = 50;
}

// Create halftone pattern
for (let i = 0; i < roughWidth; i++)
{
    for (let j = 0; j < roughHeight; j++)
    {
        let idx = j * (canvasImg.width * 4) + i * 4;
        let red = imgColData[idx];
        let green = imgColData[idx + 1];
        let blue = imgColData[idx + 2];

        // console.log(red);

        let addPix = redStencil.slice(0, Math.ceil(red / 64));
        addPix = addPix.concat(greenStencil.slice(0, Math.ceil(green / 64)));
        addPix = addPix.concat(blueStencil.slice(0, Math.ceil(blue / 64)));

        // console.log(imgColData[idx]);

        for (let pix in addPix) {
            patColData[(j + pix[1]) * (canvasImg.width * 4) + (i + pix[0]) * 4] = 0;
        }
    }
}

ctxImg.putImageData(patData, 0, 0);