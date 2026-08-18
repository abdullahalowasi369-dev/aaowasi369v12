import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');
const required = [
  'index.html',
  '404.html',
  'assets/styles.css',
  'assets/premium-v12.css',
  'assets/app.js',
  'assets/premium-v12.js',
  'career-assets/Md_Abdullah_Al_Owasi_Resume.docx',
  'career-assets/Md_Abdullah_Al_Owasi_Portfolio.docx',
  'artifacts/Governance_Evidence_Workbook.xlsx',
  'robots.txt',
  'sitemap.xml',
  '_headers'
];

const missing = required.filter((rel) => !fs.existsSync(path.join(out, rel)));
if (missing.length) {
  console.error('Output verification failed:', missing);
  process.exit(1);
}

const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
for (const signature of ['Governance systems built', 'data-governance-stage', 'premium-v12.css', 'premium-v12.js']) {
  if (!html.includes(signature)) {
    console.error(`Output HTML signature missing: ${signature}`);
    process.exit(1);
  }
}

console.log(`Output verified: ${required.length} critical files present and v12 premium layer linked.`);
