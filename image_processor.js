const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const inputDir = "./input"; // Directory containing the images
const outputDir = "./output"; // Directory to save the processed images

const targetWidth = 800; // Desired width after resizing
const targetHeight = 600; // Desired height after resizing
const cropPercentage = 0.7; // Percentage to crop from the center

async function processImages() {
  await fs.ensureDir(outputDir); // Ensure the output directory exists

  const files = await fs.readdir(inputDir);
  files.forEach(async (file) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    try {
      const resizedImage = await sharp(inputPath)
        .resize(targetWidth, targetHeight)
        .toBuffer();

      const cropWidth = Math.floor(targetWidth * cropPercentage);
      const cropHeight = Math.floor(targetHeight * cropPercentage);
      const cropLeft = Math.floor((targetWidth - cropWidth) / 2);
      const cropTop = Math.floor((targetHeight - cropHeight) / 2);

      await sharp(resizedImage)
        .extract({
          width: cropWidth,
          height: cropHeight,
          left: cropLeft,
          top: cropTop,
        })
        .toFile(outputPath);

      console.log(`Processed: ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  });
}

processImages();
