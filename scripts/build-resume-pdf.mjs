// Renders the /resume page to a static, ATS-friendly PDF with headless Chrome.
//
// Usage: npm run resume:pdf -- [resume-url]
//   resume-url  defaults to $RESUME_URL or http://localhost:8000/resume
//   $CHROME_PATH overrides the browser binary.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const resumeUrl =
    process.argv[2] ?? process.env.RESUME_URL ?? 'http://localhost:8000/resume';
const outputPath = resolve('public/Ashok-Barua-Resume.pdf');

const browserCandidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
].filter(Boolean);

const browserPath = browserCandidates.find((candidate) =>
    existsSync(candidate),
);

if (!browserPath) {
    console.error('No Chrome/Chromium found. Set CHROME_PATH.');
    process.exit(1);
}

execFileSync(
    browserPath,
    [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        '--virtual-time-budget=10000',
        `--print-to-pdf=${outputPath}`,
        resumeUrl,
    ],
    { stdio: 'inherit' },
);

console.log(`Wrote ${outputPath}`);
