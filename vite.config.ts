import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import fr from './src/content/fr.json';

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Emits dist/fr/index.html: the same app, served with French <html lang>,
 * <title>, meta description and Open Graph tags, so that crawlers and link
 * previews get French metadata at /fr/.
 */
function frenchEntry(): Plugin {
  let outDir = 'dist';
  return {
    name: 'french-entry',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const html = readFileSync(resolve(outDir, 'index.html'), 'utf8');
      const title = escapeAttr(fr.meta.title);
      const description = escapeAttr(fr.meta.description);
      const out = html
        .replace('<html lang="en">', '<html lang="fr">')
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(/(<meta name="description" content=")[^"]*"/, `$1${description}"`)
        .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${title}"`)
        .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${description}"`)
        .replace(/(<meta property="og:locale" content=")[^"]*"/, '$1fr_FR"')
        .replace(/(<meta property="og:locale:alternate" content=")[^"]*"/, '$1en_US"')
        .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${title}"`)
        .replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${description}"`)
        // Relative asset paths must climb out of /fr/.
        .replace(/(src|href)="\.\//g, '$1="../');
      mkdirSync(resolve(outDir, 'fr'), { recursive: true });
      writeFileSync(resolve(outDir, 'fr', 'index.html'), out);
    },
  };
}

export default defineConfig({
  // Relative base: works at https://<user>.github.io/ and at https://<user>.github.io/<repo>/.
  base: './',
  plugins: [react(), frenchEntry()],
});
