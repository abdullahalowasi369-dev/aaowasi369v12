# Deployment — v12

This release is a zero-dependency static portfolio: HTML, CSS, SVG/browser JavaScript and downloadable career assets. It does not require React hydration, a server runtime, a framework adapter, a third-party chart library or a font CDN.

## Pre-deploy validation
Run these from the repository root:

```bash
npm run check
npm run build
```

Expected production output: `out/`.

## Cloudflare Pages
Use the repository root.

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `out`
- Node version: **22** (also pinned by `.nvmrc` and `.node-version`)

The `_headers` file is copied into `out/` and provides security headers plus a revalidation-safe asset cache policy. The cache is deliberately not marked `immutable` because `styles.css` and `app.js` keep stable filenames across releases.

## Vercel
`vercel.json` is included and already declares:

- Framework: **Other** (`framework: null`)
- Build command: `npm run build`
- Output directory: `out`
- Security headers
- Revalidation-safe asset caching

Import the Git repository and deploy. No project-level override should be required unless an existing Vercel project has old settings that override `vercel.json`.

## Local validation

```bash
npm run check
npm run build
npm start
```

Then open `http://localhost:4173`.

## Production URL note
The canonical, sitemap and robots URL currently use the known live production address `https://aaowasi369v10.pages.dev/`. If the final production domain changes, update the same URL in `index.html`, `robots.txt` and `sitemap.xml` together before indexing the new domain.
