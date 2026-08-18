import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const required = [
  'index.html',
  'assets/styles.css',
  'assets/premium-v12.css',
  'assets/app.js',
  'assets/premium-v12.js',
  'career-assets/Md_Abdullah_Al_Owasi_Resume.docx',
  'career-assets/Md_Abdullah_Al_Owasi_Cover_Letter.docx',
  'career-assets/Md_Abdullah_Al_Owasi_Portfolio.docx',
  'career-assets/Md_Abdullah_Al_Owasi_Executive_Portfolio.pdf',
  'career-assets/Md_Abdullah_Al_Owasi_Presentation.pptx',
  'artifacts/Governance_Evidence_Matrix.xlsx',
  'artifacts/Governance_Evidence_Workbook.xlsx',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  'vercel.json',
  'DEPLOYMENT.md',
  'V12_IMPLEMENTATION_GUIDE.md'
];

const errors = [];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`Missing: ${rel}`);
}

const html = read('index.html');
const css = read('assets/styles.css') + read('assets/premium-v12.css');
const js = read('assets/app.js') + read('assets/premium-v12.js');
const robots = read('robots.txt');
const sitemap = read('sitemap.xml');

// Prevent accidental framework/runtime imports from reintroducing the dependency mismatch failures
// this static architecture was designed to avoid.
for (const token of ['next/', 'react', 'motion/react', 'recharts', 'd3', 'lenis']) {
  if (html.includes(token) || js.includes(token)) errors.push(`Runtime dependency token found: ${token}`);
}
if (/<script[^>]+src=["']https?:/i.test(html) || /<link[^>]+href=["']https?:[^>]+stylesheet/i.test(html)) {
  errors.push('External runtime CSS/JS dependency detected.');
}

if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) errors.push('CSS braces are unbalanced.');

// Validate JSON config before a deployment platform ever sees it.
for (const rel of ['package.json', 'package-lock.json', 'vercel.json']) {
  try { JSON.parse(read(rel)); }
  catch (error) { errors.push(`Invalid JSON: ${rel} (${error.message})`); }
}

// Lower-case the public Gmail address consistently to avoid case-sensitive display mismatches.
for (const email of html.matchAll(/[A-Z0-9._%+-]+@gmail\.com/g)) {
  if (email[0] !== email[0].toLowerCase()) errors.push(`Uppercase Gmail display: ${email[0]}`);
}

// Every root-relative source/download referenced from HTML must exist in the repository.
const localRefs = [...html.matchAll(/(?:href|src)=["']\/(?!\/)([^"'#?]+)["']/g)].map((m) => m[1]);
for (const rel of localRefs) {
  if (rel.endsWith('/')) continue;
  if (!fs.existsSync(path.join(root, rel))) errors.push(`Broken local reference: /${rel}`);
}

// In-page navigation must point to a real ID, and IDs must be unique.
const idList = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1]);
const ids = new Set(idList);
for (const id of ids) {
  if (idList.filter((value) => value === id).length > 1) errors.push(`Duplicate id: #${id}`);
}
for (const match of html.matchAll(/href=["']#([^"']+)["']/g)) {
  if (!ids.has(match[1])) errors.push(`Broken anchor: #${match[1]}`);
}

// Guard the two highest-value interactive visualizations from partial edits.
const flowNodes = (html.match(/data-flow-index=/g) || []).length;
const heatNodes = (html.match(/class="heat-node"/g) || []).length;
const heroCards = (html.match(/class="governance-card/g) || []).length;
if (flowNodes !== 6) errors.push(`Expected 6 operating-model nodes, found ${flowNodes}.`);
if (heatNodes !== 7) errors.push(`Expected 7 AI matrix nodes, found ${heatNodes}.`);
if (heroCards !== 7) errors.push(`Expected 7 hero governance cards, found ${heroCards}.`);

// SEO URL consistency: canonical, sitemap and robots should not silently drift apart.
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
if (canonical) {
  const origin = canonical.replace(/\/$/, '');
  if (!robots.includes(origin)) errors.push('robots.txt sitemap URL does not match the canonical origin.');
  if (!sitemap.includes(origin)) errors.push('sitemap.xml URL does not match the canonical origin.');
} else {
  errors.push('Canonical URL missing.');
}

if (errors.length) {
  console.error('Preflight failed');
  for (const error of [...new Set(errors)]) console.error(' - ' + error);
  process.exit(1);
}

console.log(
  `Preflight passed: ${required.length} required assets, ${localRefs.length} local references, ` +
  `${flowNodes} flow nodes, ${heatNodes} matrix nodes, ${heroCards} hero cards, zero external runtime dependencies.`
);
