# AAO Portfolio v12 — implementation and change guide

## What changed

v12 keeps the stable v11 static architecture and adds a separate premium interaction layer. The new layer is intentionally isolated in two files:

- `assets/premium-v12.css` — visual system, responsive behavior, card-stack depth, architecture skin, matrix repair, contact composition and cursor aura.
- `assets/premium-v12.js` — cursor-driven operating model, nearest-node AI matrix behavior, 3D hero card deck, dynamic island and pointer lighting.

The original `assets/styles.css` and `assets/app.js` remain in place, which makes rollback easy and reduces the chance of regressions to existing content, filters and downloads.

## 1. Interactive operating model

Desktop users no longer need to click six stages individually. `premium-v12.js` maps the horizontal pointer position over `[data-flow]` to the nearest stage and updates the active node plus its decision-lineage description. Pointer hover, click, keyboard focus and touch remain supported.

To change the descriptions, edit `FLOW_DETAILS` in `assets/premium-v12.js`.

## 2. AI risk and transparency matrix

The original matrix placed several nodes at the same `100% / 0%` coordinates, which caused overlap and clipping. v12 gives every use case a distinct position and uses CSS `clamp()` to keep nodes away from the plot edges.

On desktop, moving the pointer through the matrix activates the nearest use case inside a defined hover radius. Hovering or keyboard-focusing a node always activates it. Touch users can tap a node.

To move a use case, edit its inline `--x` and `--y` percentages in `index.html`. Keep values roughly inside 15–90% for the cleanest layout.

## 3. Cursor glow

The native cursor remains visible. A fixed, pointer-events-none aura reads `--mx` and `--my` and renders layered green/cyan radial light. Dark mode receives a stronger glow; light mode is deliberately softer.

To change intensity or size, edit `.cursor-aura` in `assets/premium-v12.css`.

## 4. 3D hero illustration

The portfolio snapshot now contains a seven-card governance deck representing requirement → control → evidence → exception → residual risk → decision → monitoring. It uses CSS perspective and transforms, not WebGL or a third-party 3D library.

Pointer position changes deck rotation and card emphasis. A slow autonomous focus cycle runs only when reduced motion is not requested and stops taking precedence while the user is interacting.

Card offsets live in the `.governance-card:nth-child(...)` rules in `assets/premium-v12.css`.

## 5. Dynamic island

The island appears after the first part of the hero scrolls away. It displays the current section and expands to three quick actions: Architecture, Resume and Discuss a role. It closes on outside pointer press or Escape.

The island is secondary navigation. The primary fixed navigation remains present, so an island failure cannot make the website unnavigable.

## 6. Architecture section

The Enterprise / Third-Party / AI module area is now a dark product-style workspace inspired by the supplied references while keeping the original governance content. The left module rail, large evidence panel, metrics and evidence table are readable in both site themes because the architecture workspace maintains its own dark contrast system.

## 7. Card-stack grid

Selected Systems uses a true three-column card-stack grid on wide screens, two columns on medium screens and a horizontal swipe deck on mobile. Layered pseudo-elements provide depth without adding DOM nodes or image assets.

## 8. Direct-conversation section

The contact opening now uses the requested two-column editorial composition: the high-impact governance statement on the left and the role/context paragraph on the right. The lower area keeps direct actions, mandate fit and downloadable evidence.

## 9. Typography

No external font CDN was added. The display/body stacks prefer modern platform fonts such as Avenir Next, Segoe UI Variable and SF Pro when available, with safe system fallbacks. This prevents a slow or failed font request from degrading the page or blocking first render.

## 10. Reliability measures added

- No new npm dependency.
- No external runtime CSS, JS, font or chart import.
- LocalStorage access is guarded so privacy-restricted contexts do not abort the rest of the JavaScript.
- Reduced-motion support disables autonomous/pulsing motion.
- Touch and keyboard fallbacks remain available for hover-first interactions.
- AI matrix positions are bounded so labels cannot sit directly on the plot edge.
- Dynamic island visibility is handled in the premium layer even if legacy scroll behavior changes later.
- Cloudflare and Vercel both build the same deterministic `out/` directory.
- Asset cache headers were changed from one-year immutable caching to revalidation-safe caching because the base asset filenames are stable between releases.
- Preflight verifies required files, local references, anchors, balanced CSS braces and absence of external runtime dependency tokens.
- Postbuild verifies critical production files in `out/`.

## Validation performed for v12

- `node --check assets/app.js`
- `node --check assets/premium-v12.js`
- CSS parsed with `tinycss2`: zero parse errors in both CSS files.
- HTML parsed successfully; expected counts confirmed: 6 operating-model nodes, 7 AI matrix nodes, 7 hero deck cards.
- Desktop interaction test: moving to the right side of the operating model activates **Decision**; moving to the middle activates **Evidence**.
- AI matrix hover test updates the evidence description without click.
- Dynamic island appears after scroll and expands/collapses correctly.
- Desktop layout test at 1440px: no horizontal document overflow.
- Selected Systems resolves to three equal grid columns at 1440px.
- `npm run check` passes.
- `npm run build` and postbuild verification pass.

## If you want to change the design later

Change one layer at a time. For visual changes, start in `premium-v12.css`; for interaction behavior, start in `premium-v12.js`. Avoid editing the minified base files unless you are changing an existing v11 feature. After any change, run `npm run check && npm run build` before deployment.
