# Anas Atmani — Portfolio

Bilingual (EN / FR) developer portfolio. Vite + React + TypeScript, deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # checks content, type-checks, builds into dist/
npm run preview    # serves dist/
```

## Edit the content

All text lives in two files with **exactly the same structure**:

- `src/content/en.json`
- `src/content/fr.json`

To add a project, add one object to `projects.items` in **both** files (same position).
`image` and `links.demo` can be `null`. Any value starting with `TODO` is highlighted on the page.

`npm run check:content` (also run by `npm run build`) fails if the two files differ in keys,
types or array lengths, or if a referenced image / CV is missing from `public/`.

## Images

Raw files live in `../portfolio-assets/` (CVs, photo, certificates, screenshots).
Project screenshots are 1440×900 captures of each app running locally with demo data.
`npm run images` converts them to WebP in `public/images/`, copies the design CVs to `public/cv/`
and regenerates the favicons and `og-image.png`.

## French URL

The build also emits `/fr/index.html` with French `<title>`, description and Open Graph tags,
so links shared as `…/fr/` preview in French. The EN / FR button switches language in place
and remembers the choice.
