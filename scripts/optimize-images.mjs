// Converts the raw files in ../portfolio-assets into optimized WebP files under public/.
// Usage: npm run images  (re-run whenever a source image changes)
import sharp from 'sharp';
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = (p) => resolve(root, '..', 'portfolio-assets', p);
const out = (p) => {
  const file = resolve(root, 'public', p);
  mkdirSync(dirname(file), { recursive: true });
  return file;
};

const jobs = [
  // Portrait: 1x and 2x for the hero photo.
  ['photo/anas-atmani.jpg', 'images/anas-atmani.webp', { width: 176, height: 176 }],
  ['photo/anas-atmani.jpg', 'images/anas-atmani@2x.webp', { width: 352, height: 352 }],
  // Portrait (4:5) for the hero.
  ['photo/anas-atmani.jpg', 'images/anas-atmani-portrait.webp', { width: 560, height: 700, position: 'top', quality: 86 }],
];

// Project screenshots: 1440×900 captures of each app running locally (16:10), large + small.
const projects = [
  ['relya-dashboard.png', 'relya'],
  ['pf-admin.png', 'portflow', { left: 0, top: 50, width: 960, height: 600 }],
  ['si-declaration.png', 'simplis'],
  ['fire-home.png', 'fireguard'],
  ['ecom-catalog.png', 'ecommerce'],
  ['para-catalog.png', 'parapharmacy'],
  ['gestion.png', 'equipment'],
];
for (const [file, id, extract] of projects) {
  jobs.push([`screenshots/${file}`, `images/projects/${id}.webp`, { width: 1440, height: 900, extract, quality: 82 }]);
  jobs.push([`screenshots/${file}`, `images/projects/${id}-sm.webp`, { width: 720, height: 450, extract, quality: 78 }]);
}

// Certificates: the whole certificate, as a thumbnail and a large version for the zoom view.
// Coursera images have grey side margins around the certificate; Oracle captures have a frame.
const coursera = { left: 286, top: 1, width: 1198, height: 926 };
const certificates = [
  ['oracle-java-se-17-certificate.png', 'oracle-java-se-17', { left: 73, top: 55, width: 930, height: 645 }],
  ['oracle-autonomous-ai-database-certificate.png', 'oracle-autonomous-ai-database', { left: 68, top: 60, width: 930, height: 645 }],
  ['coursera-ANQZSGG2XAZF.jpeg', 'ucsd-big-data', coursera],
  ['coursera-E981UKCSE46I.jpeg', 'google-agile', coursera],
  ['coursera-N3M56E9TZFY8.jpeg', 'meta-react-basics', coursera],
  ['coursera-5A8WUJ5H1830.jpeg', 'meta-react-native', coursera],
  ['coursera-6CIJ7JSCVF7N.jpeg', 'ibm-python', coursera],
  ['coursera-SD8AOVVLP6NS.jpeg', 'hkust-software-engineering', coursera],
  ['coursera-NX6FZQJJAHAY.jpeg', 'polytechnique-recherche-documentaire', coursera],
  ['coursera-8A66NQ2NRQ5X.jpeg', 'jhu-unix-workbench', coursera],
  ['coursera-Z9EP7HUTACNX.jpeg', 'umich-javascript', coursera],
  ['coursera-LHUE85B383KZ.jpeg', 'epfl-cpp-oop', coursera],
];
for (const [file, id, extract] of certificates) {
  jobs.push([`certificates/${file}`, `images/certificates/${id}.webp`, { width: 640, extract, fit: 'inside', quality: 80 }]);
  jobs.push([`certificates/${file}`, `images/certificates/${id}-lg.webp`, { width: 1400, extract, fit: 'inside', quality: 85 }]);
}

for (const [from, to, { width, height, position = 'top', extract, fit = 'cover', quality = 80 }] of jobs) {
  if (!existsSync(src(from))) {
    console.warn(`skip (missing): ${from}`);
    continue;
  }
  let img = sharp(src(from));
  if (extract) img = img.extract(extract);
  await img.resize(width, height, { fit, position, withoutEnlargement: fit === 'inside' }).webp({ quality }).toFile(out(to));
  console.log(`ok  ${to}`);
}

// CVs: design and ATS versions, in English and French, all downloadable from the hero.
for (const kind of ['', 'ATS_']) {
  for (const lang of ['EN', 'FR']) {
    const file = `cv/Atmani_Anas_CV_${kind}${lang}.pdf`;
    copyFileSync(src(file), out(file));
    console.log(`ok  ${file}`);
  }
}

// EMSI logo (transparent PNG) for the education section and the hero school badge.
await sharp(src('emsi/emsi-logo-src.png')).resize({ width: 600 }).webp({ quality: 90, alphaQuality: 100 }).toFile(out('images/emsi-logo.webp'));
console.log('ok  images/emsi-logo.webp');

// Favicons and Open Graph image, drawn from an SVG monogram.
const accent = '#008d36';
const monogram = (size) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${accent}"/>
  <text x="32" y="42" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="#fff">AA</text>
</svg>`);
await sharp(monogram(32)).png().toFile(out('favicon-32.png'));
await sharp(monogram(180)).png().toFile(out('apple-touch-icon.png'));

const photo = await sharp(src('photo/anas-atmani.jpg'))
  .resize(300, 300)
  .composite([{ input: Buffer.from('<svg><circle cx="150" cy="150" r="150"/></svg>'), blend: 'dest-in' }])
  .png()
  .toBuffer();
const og = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0e1116"/>
  <rect x="0" y="0" width="12" height="630" fill="${accent}"/>
  <text x="440" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="68" font-weight="700" fill="#ffffff">Anas Atmani</text>
  <text x="440" y="320" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="#3ddc84">Full Stack Developer</text>
  <text x="440" y="370" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#c9ced8">Java · Spring Boot · React</text>
  <text x="440" y="440" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#a2a9b5">PFE internship · Rabat / Casablanca / Remote</text>
</svg>`);
await sharp(og).composite([{ input: photo, left: 100, top: 165 }]).png({ compressionLevel: 9 }).toFile(out('og-image.png'));
console.log('ok  favicons + og-image.png');
