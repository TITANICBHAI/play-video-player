import { chromium } from 'playwright';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'store-listing');
const webmPath = path.join(outputDir, 'demo-raw.webm');
const mp4Path = path.join(outputDir, 'play-demo.mp4');

const TOTAL_DURATION_MS = 3000 + 4000 + 4000 + 4000 + 3000 + 3000 + 3000;
const BUFFER_MS = 2000;
const RECORD_MS = TOTAL_DURATION_MS + BUFFER_MS;

console.log(`Recording ${RECORD_MS / 1000}s of animation...`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: {
    dir: outputDir,
    size: { width: 1280, height: 720 },
  },
});

const page = await context.newPage();
await page.goto('http://localhost:26154/', { waitUntil: 'networkidle' });

await page.waitForTimeout(RECORD_MS);

const videoPath = await page.video()?.path();
await context.close();
await browser.close();

console.log(`Raw video saved at: ${videoPath}`);

if (videoPath) {
  console.log('Converting to MP4...');
  execSync(`ffmpeg -y -i "${videoPath}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p "${mp4Path}"`);
  execSync(`rm -f "${videoPath}"`);
  console.log(`MP4 saved at: ${mp4Path}`);
} else {
  console.error('No video captured!');
  process.exit(1);
}
