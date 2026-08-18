/*
 * AAO Portfolio — Premium Interaction Layer v12
 * ------------------------------------------------------------
 * Zero dependencies. Every interaction uses browser APIs already available in modern Chromium,
 * Safari and Firefox. Touch and reduced-motion fallbacks are preserved.
 *
 * Safe modification guide:
 * 1) FLOW_DETAILS controls the operating-model description text.
 * 2) HEATMAP_HOVER_RADIUS controls how far the pointer may be from a matrix node before it activates.
 * 3) focusCard(index) controls the hero card-deck emphasis.
 * 4) The dynamic island quick actions are ordinary links in index.html; edit there, not here.
 */

(() => {
  'use strict';

  const root = document.documentElement;
  const finePointer = matchMedia('(pointer:fine)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep the cursor aura independent from the legacy interaction file.
  // pointermove fires only when a pointing device actually moves, so touch-only users pay no visual cost.
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    root.style.setProperty('--mx', `${event.clientX}px`);
    root.style.setProperty('--my', `${event.clientY}px`);
  }, { passive: true });

  // ---------- Dynamic island ----------
  const island = document.querySelector('[data-island]');
  const islandToggle = document.querySelector('[data-island-toggle]');
  const islandLabel = document.querySelector('[data-island-label]');

  const syncIslandVisibility = () => {
    if (!island) return;
    island.classList.toggle('is-visible', window.scrollY > 220);
  };
  addEventListener('scroll', syncIslandVisibility, { passive: true });
  syncIslandVisibility();

  if (island && islandToggle) {
    islandToggle.addEventListener('click', () => {
      const open = island.classList.toggle('is-open');
      islandToggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('pointerdown', (event) => {
      if (!island.classList.contains('is-open') || island.contains(event.target)) return;
      island.classList.remove('is-open');
      islandToggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        island.classList.remove('is-open');
        islandToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Use the same section observer as the original site, but write to the explicit island label.
  if (islandLabel && 'IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('[data-section-title]')];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) islandLabel.textContent = visible.target.dataset.sectionTitle || 'AAO Portfolio';
    }, { rootMargin: '-30% 0px -58% 0px', threshold: [.01, .08, .16] });
    sections.forEach((section) => observer.observe(section));
  }

  // ---------- Cursor-driven operating model ----------
  const FLOW_DETAILS = [
    'Requirement: material obligation, risk expectation or business need.',
    'Control: behavior, configuration or process intended to manage the requirement.',
    'Evidence: inspectable proof that the control exists and operates as expected.',
    'Exception: gap, uncertainty, failed test or dependency that changes the control state.',
    'Residual risk: exposure remaining after current controls and exceptions are considered.',
    'Decision: approve, remediate, accept, escalate or reject with accountable ownership.'
  ];

  document.querySelectorAll('[data-flow]').forEach((flow) => {
    const nodes = [...flow.querySelectorAll('[data-flow-index]')];
    const detail = flow.parentElement?.querySelector('[data-flow-detail]');
    let current = -1;

    const activate = (index, animate = true) => {
      const safeIndex = Math.max(0, Math.min(nodes.length - 1, index));
      if (safeIndex === current) return;
      current = safeIndex;
      nodes.forEach((node, i) => node.classList.toggle('active', i === safeIndex));
      flow.parentElement?.style.setProperty('--flow-x', `${((safeIndex + .5) / nodes.length) * 100}%`);
      if (!detail) return;
      if (animate && !reducedMotion) {
        detail.classList.add('is-swapping');
        window.setTimeout(() => {
          detail.textContent = FLOW_DETAILS[safeIndex];
          detail.classList.remove('is-swapping');
        }, 85);
      } else {
        detail.textContent = FLOW_DETAILS[safeIndex];
      }
    };

    // Fine pointer: horizontal cursor position chooses a stage; no click required.
    flow.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = flow.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(.9999, (event.clientX - rect.left) / rect.width));
      activate(Math.floor(ratio * nodes.length));
    });
    flow.addEventListener('pointerleave', () => activate(current < 0 ? 0 : current, false));

    // Keyboard, mouse click and touch remain as fallbacks for accessibility.
    nodes.forEach((node, index) => {
      node.addEventListener('pointerenter', () => activate(index));
      node.addEventListener('focus', () => activate(index));
      node.addEventListener('click', () => activate(index));
    });

    activate(0, false);
  });

  // ---------- AI risk matrix: nearest-node hover ----------
  const HEATMAP_HOVER_RADIUS = 150;
  document.querySelectorAll('.heatmap').forEach((heatmap) => {
    const nodes = [...heatmap.querySelectorAll('.heat-node')];
    const detail = heatmap.parentElement?.querySelector('[data-heat-detail]');
    let active = null;

    const activate = (node) => {
      if (!node || node === active) return;
      active = node;
      nodes.forEach((candidate) => candidate.classList.toggle('active', candidate === node));
      if (!detail) return;
      detail.classList.add('is-swapping');
      window.setTimeout(() => {
        detail.textContent = `${node.dataset.case} · ${node.dataset.detail}`;
        detail.classList.remove('is-swapping');
      }, reducedMotion ? 0 : 75);
    };

    nodes.forEach((node) => {
      node.addEventListener('pointerenter', () => activate(node));
      node.addEventListener('focus', () => activate(node));
      node.addEventListener('click', () => activate(node));
    });

    heatmap.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = heatmap.getBoundingClientRect();
      heatmap.style.setProperty('--heat-x', `${event.clientX - rect.left}px`);
      heatmap.style.setProperty('--heat-y', `${event.clientY - rect.top}px`);

      let nearest = null;
      let nearestDistance = Infinity;
      nodes.forEach((node) => {
        const nodeRect = node.getBoundingClientRect();
        const dx = event.clientX - (nodeRect.left + nodeRect.width / 2);
        const dy = event.clientY - (nodeRect.top + nodeRect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < nearestDistance) {
          nearest = node;
          nearestDistance = distance;
        }
      });
      if (nearest && nearestDistance <= HEATMAP_HOVER_RADIUS) activate(nearest);
    });

    if (nodes[0]) activate(nodes[0]);
  });

  // ---------- 3D hero governance deck ----------
  const stage = document.querySelector('[data-governance-stage]');
  const deckCards = stage ? [...stage.querySelectorAll('.governance-card')] : [];
  let focusIndex = Math.min(3, Math.max(0, deckCards.length - 1));
  let autoTimer = null;

  const focusCard = (index) => {
    if (!deckCards.length) return;
    focusIndex = (index + deckCards.length) % deckCards.length;
    deckCards.forEach((card, i) => card.classList.toggle('is-focus', i === focusIndex));
  };

  if (stage && deckCards.length) {
    focusCard(focusIndex);

    if (!reducedMotion) {
      stage.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const rect = stage.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - .5;
        const py = (event.clientY - rect.top) / rect.height - .5;
        stage.style.setProperty('--stage-ry', `${(px * 22).toFixed(2)}deg`);
        stage.style.setProperty('--stage-rx', `${(-6 - py * 12).toFixed(2)}deg`);

        const normalized = Math.max(0, Math.min(.9999, (event.clientX - rect.left) / rect.width));
        focusCard(Math.floor(normalized * deckCards.length));
      });
      stage.addEventListener('pointerleave', () => {
        stage.style.setProperty('--stage-ry', '11deg');
        stage.style.setProperty('--stage-rx', '-7deg');
      });
    }

    // Slow autonomous emphasis keeps the hero alive without blocking pointer control.
    if (!reducedMotion) {
      autoTimer = window.setInterval(() => {
        if (!stage.matches(':hover')) focusCard(focusIndex + 1);
      }, 2400);
    }

    deckCards.forEach((card, index) => card.addEventListener('pointerenter', () => focusCard(index)));
  }

  // ---------- Section cards: subtle pointer lighting ----------
  if (!reducedMotion) {
    document.querySelectorAll('.value-card,.project-card,.framework-card,.skill-card,.mandate-card,.evidence-shortcuts a').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--card-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--card-y', `${event.clientY - rect.top}px`);
      });
    });
  }

  // Avoid timer retention if the page is put into the back-forward cache.
  addEventListener('pagehide', () => { if (autoTimer) clearInterval(autoTimer); }, { once: true });
})();
