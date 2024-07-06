import { readFile, mkdir } from "fs/promises";
import { glob } from "glob";
import { basename, join } from "path";
import sharp from "sharp";

const imagesDir = join(__dirname, "../images");
const originalsDir = join(imagesDir, "originals");

async function resizeImage(filePath: string) {
  try {
    const fileName = basename(filePath);
    const newPath = filePath.replace("originals", "resized");
    const newPathDir = newPath.replace(fileName, "");

    await mkdir(newPathDir, { recursive: true });

    const fileBuffer = await readFile(filePath);
    await sharp(fileBuffer)
      .resize({
        height: 500,
        width: 500,
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .sharpen()
      .toFile(newPath);

    console.log(`Image resized to 500x500 pixels. Image name: ${fileName}`);
  } catch (error) {
    console.error("Error resizing image:", error);
  }
}

if (require.main === module) {
  (async () => {
    const images = await glob(join(originalsDir, "**/**.**"), {
      absolute: false,
    });

    for (const image of images) {
      resizeImage(image);
    }
  })();
}
