// Checks that en.json and fr.json have exactly the same structure (keys, types, array
// lengths), that every referenced file in public/ exists, and lists remaining TODOs.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = (lang) => JSON.parse(readFileSync(resolve(root, 'src/content', `${lang}.json`), 'utf8'));
const en = load('en');
const fr = load('fr');

const errors = [];
const todos = [];
const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);

function compare(a, b, path) {
  const ta = typeOf(a);
  const tb = typeOf(b);
  // null and object are interchangeable (e.g. an optional image or demo link).
  const compatible = ta === tb || (ta === 'null' && tb === 'object') || (ta === 'object' && tb === 'null') || (ta === 'null' && tb === 'string') || (ta === 'string' && tb === 'null');
  if (!compatible) {
    errors.push(`${path}: type ${ta} (en) ≠ ${tb} (fr)`);
    return;
  }
  if (ta === 'array') {
    if (a.length !== b.length) errors.push(`${path}: ${a.length} items (en) ≠ ${b.length} items (fr)`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) compare(a[i], b[i], `${path}[${i}]`);
  } else if (ta === 'object' && tb === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (!(k in a)) errors.push(`${path}.${k}: missing in en.json`);
      else if (!(k in b)) errors.push(`${path}.${k}: missing in fr.json`);
      else compare(a[k], b[k], `${path}.${k}`);
    }
  }
}
compare(en, fr, '$');

function walk(value, path, lang) {
  if (typeof value === 'string') {
    if (value.startsWith('TODO')) todos.push(`${lang} ${path}: ${value}`);
    if (/^(images|cv)\//.test(value) && !existsSync(resolve(root, 'public', value))) {
      errors.push(`${lang} ${path}: file not found public/${value}`);
    }
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, Array.isArray(value) ? `${path}[${k}]` : `${path}.${k}`, lang);
  }
}
walk(en, '$', 'en');
walk(fr, '$', 'fr');

if (todos.length) {
  console.warn(`\n${todos.length} TODO(s) left in content:`);
  for (const t of todos) console.warn(`  - ${t}`);
}
if (errors.length) {
  console.error(`\n✗ Content check failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n✓ en.json and fr.json have the same structure; all referenced files exist.');
