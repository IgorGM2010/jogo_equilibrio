import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svgBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="102" fill="#2CA6A4"/>
  <text x="256" y="256" font-size="300" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-weight="bold" fill="white">E</text>
  <circle cx="384" cy="128" r="42" fill="#FFD166"/>
</svg>`);

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(path.join(__dirname, 'public', 'icons', `icon-${size}x${size}.png`));
  console.log(`Generated icon-${size}x${size}.png`);
}

console.log('Done!');
