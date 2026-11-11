/* ==========================================================================
   SMSH | Artisan Smashed Burgers — Multi-Page Barba + GSAP + Lenis Engine
   Strictly follows AGENT.md architecture, liquid preloader, Barba liquid
   wave page transitions (no burger), masked reveals, cart & contact form.
   ========================================================================== */

(() => {
  'use strict';

  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const SMSH = {
    lenis: null,
    isMenuOpen: false,
    isDarkNav: false,
    isTransitioning: false,
    heroRevealed: false,
    heroAnimating: false,
    pendingHash: '',
    currentNamespace: 'home',
    lineSplitTriggers: [],
    pageCtx: null,
    pageCleanups: [],
    navDarkTriggers: [],
    cart: [],
    cartOpen: false,
    syncToggleTheme: null,
    showNav: null,
    closeMenu: null,
    refreshCartUI: null,
  };

  function addPageCleanup(fn) {
    if (typeof fn === 'function') SMSH.pageCleanups.push(fn);
  }

  function normalizePath(pathname) {
    let p = (pathname || '/').replace(/\/+$/, '');
    if (!p || p === '') return '/index.html';
    if (!p.endsWith('.html')) return p + '.html';
    return p;
  }

  function resolveHashTarget(container, hash) {
    if (!hash || !hash.startsWith('#')) return null;
    if (hash === '#map' || hash === '#map-section') {
      const sel = window.innerWidth < 768 ? '#map-mobile' : '#map-desktop';
      return container.querySelector(sel) || document.querySelector(sel);
    }
    try {
      return container.querySelector(hash) || document.querySelector(hash);
    } catch {
      return null;
    }
  }

  function getActiveContainer() {
    return document.querySelector('[data-barba="container"]') || document.body;
  }

  /* ------------------------------------------------------------------------
     1. LENIS SMOOTH SCROLL + GSAP SCROLLTRIGGER SYNC
     ------------------------------------------------------------------------ */
  function initSmoothScroll() {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Lock page scroll while initial Preloader is active
    lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    SMSH.lenis = lenis;
    if (window.SMSH) window.SMSH.lenis = lenis;
  }

  /* ------------------------------------------------------------------------
     2. TRUE VISUAL LINE SPLITTER FOR MASKED PARAGRAPHS ([data-line-mask])
     ------------------------------------------------------------------------ */
  function splitElementIntoLines(el) {
    const rawText = (el.dataset.rawText || el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!rawText) return [];

    el.dataset.rawText = rawText;
    el.setAttribute('aria-label', rawText);

    el.innerHTML = '';
    const words = rawText.split(' ');
    const tempSpans = [];

    words.forEach((word, idx) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = word;
      el.appendChild(span);
      tempSpans.push(span);
      if (idx < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });

    const lines = [];
    let currentLine = [];
    let lastTop = null;

    tempSpans.forEach((span) => {
      const top = Math.round(span.offsetTop);
      if (lastTop === null || Math.abs(top - lastTop) <= 4) {
        currentLine.push(span.textContent);
        if (lastTop === null) lastTop = top;
      } else {
        lines.push(currentLine.join(' '));
        currentLine = [span.textContent];
        lastTop = top;
      }
    });
    if (currentLine.length) {
      lines.push(currentLine.join(' '));
    }

    el.innerHTML = '';
    const innerLines = [];
    lines.forEach((lineText) => {
      const mask = document.createElement('span');
      mask.className = 'line-mask';
      mask.setAttribute('aria-hidden', 'true');

      const inner = document.createElement('span');
      inner.className = 'line-mask-inner';
      inner.textContent = lineText;

      mask.appendChild(inner);
      el.appendChild(mask);
      innerLines.push(inner);
    });

    return innerLines;
  }

  function setupMaskedLineAnimations(container = getActiveContainer()) {
    SMSH.lineSplitTriggers.forEach((st) => st.kill());
    SMSH.lineSplitTriggers = [];

    container.querySelectorAll('[data-line-mask="true"]').forEach((el) => {
      const innerLines = splitElementIntoLines(el);
      if (!innerLines.length) return;

      const isHero = el.getAttribute('data-hero-lines') === 'true';

      if (isHero) {
        if (SMSH.heroRevealed) {
          gsap.set(innerLines, { yPercent: 0, opacity: 1 });
        } else {
          gsap.set(innerLines, { yPercent: 115, opacity: 0 });
        }
      } else {
        gsap.set(innerLines, { yPercent: 115, opacity: 0 });
        const tween = gsap.to(innerLines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
        if (tween.scrollTrigger) {
          SMSH.lineSplitTriggers.push(tween.scrollTrigger);
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. HERO PREPARATION & ENTRANCE (HOME 1:1 + SUBPAGES)
     ------------------------------------------------------------------------ */
  function prepareHeroStates(container = getActiveContainer()) {
    const heroWords = gsap.utils.toArray('[data-hero-entrance="true"]', container);
    const heroLineInners = gsap.utils.toArray('[data-hero-lines="true"] .line-mask-inner', container);
    const heroBurgerInner = container.querySelector('#hero-burger-inner');

    if (heroWords.length) {
      gsap.killTweensOf(heroWords);
      gsap.set(heroWords, {
        opacity: 0,
        scale: 0,
        y: () => gsap.utils.random(18, 40),
        rotation: () => gsap.utils.random(-16, 16),
        transformOrigin: '50% 90%',
        force3D: true,
      });
    }

    if (heroLineInners.length) {
      gsap.killTweensOf(heroLineInners);
      gsap.set(heroLineInners, { yPercent: 115, opacity: 0, force3D: true });
    }

    if (heroBurgerInner) {
      gsap.killTweensOf(heroBurgerInner);
      gsap.set(heroBurgerInner, { opacity: 0, scale: 0.5, y: 100, rotation: -5, force3D: true });
    }
  }

  function triggerPageHeroEntrance(container = getActiveContainer(), { immediate = false } = {}) {
    if (SMSH.heroRevealed) return;
    SMSH.heroRevealed = true;
    SMSH.heroAnimating = !immediate;

    const namespace = container.getAttribute('data-barba-namespace') || 'home';
    const heroLineInners = gsap.utils.toArray('[data-hero-lines="true"] .line-mask-inner', container);
    const heroBurgerInner = container.querySelector('#hero-burger-inner');

    if (immediate) {
      const allHeroWords = gsap.utils.toArray('[data-hero-entrance="true"]', container);
      gsap.set(allHeroWords, { opacity: 1, scale: 1, y: 0, rotation: 0 });
      gsap.set(heroLineInners, { yPercent: 0, opacity: 1 });
      if (heroBurgerInner) {
        gsap.set(heroBurgerInner, { opacity: 1, scale: 1, y: 0, rotation: 0 });
        gsap.to(heroBurgerInner, {
          y: -15,
          duration: 2.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          force3D: true,
        });
      }
      return;
    }

    if (namespace === 'home') {
      const headingWords = gsap.utils.toArray('[data-hero-step="heading"]', container);
      const stampWords = gsap.utils.toArray('[data-hero-step="stamp"]', container);
      const wordmarkEl = gsap.utils.toArray('[data-hero-step="wordmark"]', container);

      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
          SMSH.heroAnimating = false;
        },
      });

      const pop = (targets, at, { duration = 0.72, stagger = 0.055, ease = 'back.out(2.35)' } = {}) => {
        if (!targets.length) return;
        tl.to(targets, { opacity: 1, scale: 1, y: 0, rotation: 0, duration, stagger, ease, force3D: true }, at);
      };

      pop(headingWords, 0);
      pop(stampWords, 0.15);
      pop(wordmarkEl, 0.8);

      if (heroLineInners.length) {
        tl.to(heroLineInners, { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.07, ease: 'expo.out', force3D: true }, 0.25);
      }

      if (heroBurgerInner) {
        tl.to(heroBurgerInner, { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 1.5, ease: 'back.out(1.5)', force3D: true }, 0.5);
        gsap.to(heroBurgerInner, {
          y: -15,
          duration: 2.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.7,
          force3D: true,
          overwrite: false,
        });
      }
    } else {
      const words = gsap.utils.toArray('[data-hero-entrance="true"]', container);
      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
          SMSH.heroAnimating = false;
        },
      });

      if (words.length) {
        tl.to(
          words,
          { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.72, stagger: 0.055, ease: 'back.out(2.35)', force3D: true },
          0
        );
      }

      if (heroLineInners.length) {
        tl.to(
          heroLineInners,
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.07, ease: 'expo.out', force3D: true },
          0.18
        );
      }
    }
  }

  function initHeroParallax(container) {
    const heroSection = container.querySelector('#hero');
    const heroImg = container.querySelector('#hero-burger-inner img');
    if (!heroSection || !heroImg || window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(heroImg, 'x', { duration: 0.85, ease: 'power3.out' });
    const yTo = gsap.quickTo(heroImg, 'y', { duration: 0.85, ease: 'power3.out' });
    const rotTo = gsap.quickTo(heroImg, 'rotation', { duration: 0.95, ease: 'power3.out' });

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xTo(nx * 26);
      yTo(ny * 20);
      rotTo(nx * 4.5);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      rotTo(0);
    };

    heroSection.addEventListener('mousemove', onMove, { passive: true });
    heroSection.addEventListener('mouseleave', onLeave);
    addPageCleanup(() => {
      heroSection.removeEventListener('mousemove', onMove);
      heroSection.removeEventListener('mouseleave', onLeave);
    });
  }

  /* ------------------------------------------------------------------------
     4. SCROLL-TRIGGERED POP WORDS & INLINE MASK REVEALS
     ------------------------------------------------------------------------ */
  function initScrollTextAnimations(container) {
    const scrollPopGroups = new Map();
    container
      .querySelectorAll('[data-pop="true"]:not([data-hero-entrance="true"])')
      .forEach((el) => {
        const triggerParent = el.closest('h1, h2, h3, p, [data-pop-group]') || el.parentElement;
        if (!scrollPopGroups.has(triggerParent)) {
          scrollPopGroups.set(triggerParent, []);
        }
        scrollPopGroups.get(triggerParent).push(el);
      });

    scrollPopGroups.forEach((words, triggerEl) => {
      gsap.set(words, {
        opacity: 0,
        scale: 0.45,
        yPercent: 50,
        rotation: (i) => (i % 2 === 0 ? -6 : 6),
      });

      gsap.to(words, {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        rotation: 0,
        duration: 0.85,
        stagger: 0.07,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top 94%',
          toggleActions: 'play none none none',
        },
      });
    });

    container
      .querySelectorAll('[data-mask-reveal]:not([data-hero-entrance="true"])')
      .forEach((el) => {
        gsap.set(el, { opacity: 0, yPercent: 112 });

        gsap.to(el, {
          opacity: 1,
          yPercent: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        });
      });
  }

  /* ------------------------------------------------------------------------
     5. INITIAL PRELOADER (COMPACT BURGER + LIQUID CURTAINS)
     ------------------------------------------------------------------------ */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const container = getActiveContainer();
    if (!preloader) {
      SMSH.lenis?.start();
      triggerPageHeroEntrance(container);
      return;
    }

    const layers = gsap.utils.toArray('.preloader-layer');
    const dots = gsap.utils.toArray('.preloader-dot');
    const stage = document.getElementById('preloader-burger-stage');
    const captionWrap = document.getElementById('preloader-caption-wrap');
    const statusEl = document.getElementById('preloader-status');
    const barEl = document.getElementById('preloader-bar');
    const progressContainer = document.getElementById('preloader-progressbar');

    const wave1 = document.getElementById('preloader-wave-1');
    const wave2 = document.getElementById('preloader-wave-2');
    const wave3 = document.getElementById('preloader-wave-3');

    gsap.set(layers, {
      xPercent: 0,
      x: 0,
      y: -260,
      scale: 0.86,
      opacity: 0,
      rotation: (i, el) => {
        const baseRot = parseFloat(el.getAttribute('data-rotate') || '0');
        return baseRot + (i % 2 === 0 ? -10 : 10);
      },
    });

    const progressState = { value: 0 };
    const tl = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        preloader.style.display = 'none';
        preloader.setAttribute('aria-hidden', 'true');
        SMSH.lenis?.start();
        ScrollTrigger.refresh();
        if (window.location.hash) {
          const target = resolveHashTarget(getActiveContainer(), window.location.hash);
          if (target) {
            SMSH.lenis?.scrollTo(target, { offset: 0, duration: 1.0 });
          }
        }
      },
    });

    tl.to(
      progressState,
      {
        value: 100,
        duration: 1.55,
        ease: 'sine.inOut',
        onUpdate: () => {
          const pct = Math.round(progressState.value);
          if (barEl) barEl.style.width = `${progressState.value.toFixed(2)}%`;
          if (progressContainer) progressContainer.setAttribute('aria-valuenow', String(pct));
        },
      },
      0
    );

    layers.forEach((layer, idx) => {
      const startAt = 0.06 + idx * 0.17;
      const landAt = startAt + 0.28;
      const targetRotate = parseFloat(layer.getAttribute('data-rotate') || '0');
      const label = layer.getAttribute('data-label');

      if (label && statusEl) {
        tl.call(
          () => {
            statusEl.textContent = label;
          },
          null,
          startAt + 0.03
        );
      }

      tl.to(layer, { opacity: 1, duration: 0.18, ease: 'sine.out' }, startAt)
        .to(layer, { y: 0, scale: 1, duration: 0.28, ease: 'power2.out' }, startAt)
        .to(layer, { rotation: targetRotate, duration: 0.42, ease: 'back.out(2.2)' }, landAt);

      if (stage) {
        tl.to(stage, { scaleY: 0.92, scaleX: 1.04, duration: 0.06, ease: 'power2.out' }, landAt)
          .to(stage, { scaleY: 1.02, scaleX: 0.99, duration: 0.08, ease: 'sine.inOut' }, landAt + 0.06)
          .to(stage, { scaleY: 1, scaleX: 1, duration: 0.12, ease: 'power2.out' }, landAt + 0.14);
      }
    });

    const celebrateAt = 0.06 + (layers.length - 1) * 0.17 + 0.35;

    if (statusEl) {
      tl.call(
        () => {
          statusEl.textContent = 'READY TO SMSH!';
        },
        null,
        celebrateAt
      );
    }

    if (stage) {
      tl.to(stage, { y: -24, scale: 1.05, rotation: 1.5, duration: 0.24, ease: 'power2.out' }, celebrateAt).to(
        stage,
        { y: 0, scale: 1, rotation: 0, duration: 0.36, ease: 'bounce.out' },
        celebrateAt + 0.24
      );
    }

    dots.forEach((dot, i) => {
      const angle = (i / dots.length) * Math.PI * 2;
      const distance = 90 + (i % 3) * 28;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 14;

      tl.fromTo(
        dot,
        { x: 0, y: 0, scale: 0, opacity: 1 },
        { x: tx, y: ty, scale: 1.15, opacity: 0, duration: 0.65, ease: 'power2.out' },
        celebrateAt
      );
    });

    const curtainStart = 1.85;
    tl.to(
      [captionWrap, progressContainer],
      {
        y: 36,
        opacity: 0,
        duration: 0.32,
        ease: 'power2.in',
        onComplete: () => {
          window.scrollTo(0, 0);
          SMSH.lenis?.scrollTo(0, { immediate: true });
        },
      },
      curtainStart - 0.18
    );

    if (stage) {
      tl.to(stage, { y: -420, opacity: 0, scale: 0.9, duration: 0.55, ease: 'power2.in' }, curtainStart);
    }

    const waves = [wave3, wave2, wave1].filter(Boolean);
    waves.forEach((wavePath, idx) => {
      const state = { yLeft: 101, yRight: 101, yCenter: 101 };
      const t0 = curtainStart + 0.08 + idx * 0.11;

      const renderWave = () => {
        wavePath.setAttribute(
          'd',
          `M -1 -1 L 101 -1 L 101 ${state.yRight.toFixed(2)} Q 50 ${state.yCenter.toFixed(2)} -1 ${state.yLeft.toFixed(2)} Z`
        );
      };

      tl.to(state, { yLeft: -2, yRight: -2, duration: 0.82, ease: 'power3.inOut', onUpdate: renderWave }, t0).to(
        state,
        { yCenter: -2, duration: 1.05, ease: 'expo.inOut', onUpdate: renderWave },
        t0
      );
    });

    tl.call(
      () => {
        preloader.style.pointerEvents = 'none';
      },
      null,
      curtainStart + 0.42
    );
    tl.call(() => triggerPageHeroEntrance(getActiveContainer()), null, curtainStart + 0.85);
  }

  /* ------------------------------------------------------------------------
     5B. BARBA.JS PAGE TRANSITION — 1:1 EXACT MATCH TO CRAVBURGERS.SHOP (MODULE 82148)
     ------------------------------------------------------------------------ */
  function playLiquidCoverIn() {
    const overlay = document.getElementById('page-transition');
    const labelWrap = document.getElementById('pt-label-wrap');
    const labelText = document.getElementById('pt-label-text');
    const waves = [
      document.getElementById('pt-wave-1'),
      document.getElementById('pt-wave-2'),
      document.getElementById('pt-wave-3'),
    ].filter(Boolean);

    if (!overlay || !waves.length) return Promise.resolve();

    gsap.killTweensOf(waves);
    if (labelWrap) gsap.killTweensOf(labelWrap);
    if (labelText) labelText.textContent = 'Craving...';

    gsap.set(waves, { attr: { d: 'M -1 101 L 101 101 L 101 101 Q 50 101 -1 101 Z' } });
    if (labelWrap) gsap.set(labelWrap, { opacity: 0, scale: 0.7, y: 30, force3D: true });

    overlay.style.display = 'block';
    overlay.style.pointerEvents = 'auto';

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: resolve,
      });

      waves.forEach((wavePath, idx) => {
        const state = { yLeft: 101, yRight: 101, yCenter: 101 };
        const renderCover = () => {
          wavePath.setAttribute(
            'd',
            `M -1 101 L 101 101 L 101 ${state.yRight.toFixed(2)} Q 50 ${state.yCenter.toFixed(2)} -1 ${state.yLeft.toFixed(2)} Z`
          );
        };
        const t0 = idx * 0.1;
        tl.to(state, { yCenter: -1, duration: 0.65, ease: 'power2.out', onUpdate: renderCover }, t0).to(
          state,
          { yLeft: -1, yRight: -1, duration: 0.85, ease: 'power3.inOut', onUpdate: renderCover },
          t0
        );
      });

      if (labelWrap) {
        tl.fromTo(
          labelWrap,
          { scale: 0.7, opacity: 0, y: 30, force3D: true },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)', force3D: true },
          '-=0.4'
        );
      }
    });
  }

  function playLiquidRevealOut(onRevealStart) {
    const overlay = document.getElementById('page-transition');
    const labelWrap = document.getElementById('pt-label-wrap');
    const waves = [
      document.getElementById('pt-wave-3'),
      document.getElementById('pt-wave-2'),
      document.getElementById('pt-wave-1'),
    ].filter(Boolean);

    if (!overlay || !waves.length) {
      if (onRevealStart) onRevealStart();
      return Promise.resolve();
    }

    gsap.killTweensOf(waves);
    if (labelWrap) gsap.killTweensOf(labelWrap);

    gsap.set(waves, { attr: { d: 'M -1 -1 L 101 -1 L 101 101 Q 50 101 -1 101 Z' } });

    overlay.style.display = 'block';
    overlay.style.pointerEvents = 'auto';

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
          overlay.style.display = 'none';
          overlay.style.pointerEvents = 'none';
          if (labelWrap) gsap.set(labelWrap, { opacity: 0, scale: 1, y: 0 });
          resolve();
        },
      });

      waves.forEach((wavePath, idx) => {
        const state = { yLeft: 101, yRight: 101, yCenter: 101 };
        const renderLift = () => {
          wavePath.setAttribute(
            'd',
            `M -1 -1 L 101 -1 L 101 ${state.yRight.toFixed(2)} Q 50 ${state.yCenter.toFixed(2)} -1 ${state.yLeft.toFixed(2)} Z`
          );
        };
        const t0 = idx * 0.1;
        tl.to(state, { yLeft: -1, yRight: -1, duration: 0.75, ease: 'power2.inOut' }, t0).to(
          state,
          { yCenter: -1, duration: 1.05, ease: 'power4.inOut', onUpdate: renderLift },
          t0
        );
      });

      if (labelWrap) {
        tl.fromTo(
          labelWrap,
          { scale: 1, opacity: 1, y: 0, force3D: true },
          { scale: 1.3, opacity: 0, duration: 0.4, ease: 'power2.in', force3D: true },
          0
        );
      }

      if (onRevealStart) {
        tl.call(onRevealStart, null, 0.42);
      }
    });
  }

  function prepareSectionEntrance(sectionEl) {
    if (!sectionEl) return;
    const popWords = gsap.utils.toArray('[data-pop="true"]', sectionEl);
    const maskLines = gsap.utils.toArray('.line-mask-inner, [data-mask-reveal]', sectionEl);

    // Kill only text ScrollTriggers inside this target section so they don't double-fire
    ScrollTrigger.getAll().forEach((st) => {
      const trig = st.vars && st.vars.trigger;
      if (
        trig instanceof Element &&
        sectionEl.contains(trig) &&
        trig.matches('h1, h2, h3, p, [data-pop-group], [data-line-mask], [data-mask-reveal]')
      ) {
        st.kill();
      }
    });

    if (popWords.length) {
      gsap.killTweensOf(popWords);
      gsap.set(popWords, {
        opacity: 0,
        scale: 0.45,
        yPercent: 45,
        rotation: (i) => (i % 2 === 0 ? -7 : 7),
        force3D: true,
      });
    }
    if (maskLines.length) {
      gsap.killTweensOf(maskLines);
      gsap.set(maskLines, { opacity: 0, yPercent: 110, force3D: true });
    }
  }

  function playSectionEntrance(sectionEl) {
    if (!sectionEl) return;
    const popWords = gsap.utils.toArray('[data-pop="true"]', sectionEl);
    const maskLines = gsap.utils.toArray('.line-mask-inner, [data-mask-reveal]', sectionEl);
    const mediaImgs = gsap.utils.toArray('#about-media-stage .media-item img', sectionEl);
    const menuCards = gsap.utils.toArray('[data-menu-card="true"]:not(.hidden)', sectionEl);
    const stickers = gsap.utils.toArray('.sticker-wrapper', sectionEl);

    if (stickers.length) {
      stickers.forEach((w) => {
        gsap.to(w, { '--peel-amount': 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
      });
    }
    if (popWords.length) {
      gsap.to(popWords, {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        rotation: 0,
        duration: 0.82,
        stagger: 0.055,
        ease: 'back.out(1.85)',
        force3D: true,
        overwrite: 'auto',
      });
    }
    if (maskLines.length) {
      gsap.to(maskLines, {
        opacity: 1,
        yPercent: 0,
        duration: 0.92,
        stagger: 0.06,
        ease: 'expo.out',
        force3D: true,
        overwrite: 'auto',
      });
    }
    if (mediaImgs.length) {
      gsap.to(mediaImgs, {
        opacity: 1,
        scale: 1.03,
        duration: 0.95,
        stagger: 0.08,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }
    if (menuCards.length) {
      gsap.to(menuCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.72,
        stagger: 0.06,
        ease: 'back.out(1.5)',
        overwrite: 'auto',
      });
    }
  }

  async function runSamePageLiquidTransition(targetUrl) {
    if (SMSH.isTransitioning) return;
    SMSH.isTransitioning = true;

    try {
      if (SMSH.isMenuOpen && typeof SMSH.closeMenu === 'function') {
        SMSH.closeMenu(false);
      }
      if (SMSH.cartOpen && typeof SMSH.closeCart === 'function') {
        SMSH.closeCart();
      }
      SMSH.lenis?.stop();

      await playLiquidCoverIn();

      const nextHref = targetUrl.hash
        ? `${targetUrl.pathname}${targetUrl.hash}`
        : targetUrl.pathname;
      window.history.pushState(null, '', nextHref);

      const container = getActiveContainer();
      const targetEl = targetUrl.hash ? resolveHashTarget(container, targetUrl.hash) : null;
      const destY = targetEl
        ? Math.max(0, Math.round(targetEl.getBoundingClientRect().top + window.scrollY))
        : 0;

      window.scrollTo(0, destY);
      SMSH.lenis?.scrollTo(destY, { immediate: true });
      SMSH.showNav?.();
      ScrollTrigger.update();
      ScrollTrigger.refresh();
      attachNavDarkTriggers(container);

      if (targetEl) {
        prepareSectionEntrance(targetEl);
      } else {
        SMSH.heroRevealed = false;
        SMSH.heroAnimating = false;
        prepareHeroStates(container);
      }

      await playLiquidRevealOut(() => {
        if (targetEl) {
          playSectionEntrance(targetEl);
        } else {
          triggerPageHeroEntrance(container);
        }
      });
    } finally {
      ScrollTrigger.refresh();
      SMSH.lenis?.start();
      SMSH.isTransitioning = false;
    }
  }

  function initBarbaTransitions() {
    if (typeof window.barba === 'undefined') return;

    window.barba.init({
      preventRunning: true,
      prevent: ({ el, href }) => {
        if (!el) return false;
        try {
          const targetUrl = new URL(href, window.location.href);
          if (targetUrl.origin !== window.location.origin) return true;
          const curPath = normalizePath(window.location.pathname);
          const nextPath = normalizePath(targetUrl.pathname);
          return curPath === nextPath;
        } catch {
          return false;
        }
      },
      transitions: [
        {
          name: 'smsh-liquid-layers',
          async leave(data) {
            try {
              SMSH.isTransitioning = true;
              if (SMSH.closeMenu) SMSH.closeMenu(false);
              if (SMSH.cartOpen && typeof SMSH.closeCart === 'function') SMSH.closeCart();
              if (data.trigger && data.trigger.href) {
                try {
                  SMSH.pendingHash = new URL(data.trigger.href, window.location.href).hash || '';
                } catch {
                  SMSH.pendingHash = '';
                }
              } else if (data.next && data.next.url && data.next.url.href) {
                SMSH.pendingHash = data.next.url.hash || '';
              } else {
                SMSH.pendingHash = '';
              }
              SMSH.lenis?.stop();
              await playLiquidCoverIn();
            } catch {
              SMSH.isTransitioning = false;
              const fallbackHref = data?.next?.url?.href || data?.trigger?.href;
              if (fallbackHref) window.location.assign(fallbackHref);
            }
          },
          async beforeEnter(data) {
            try {
              cleanupPage();
              data.current.container.style.display = 'none';
              window.scrollTo(0, 0);
              SMSH.lenis?.scrollTo(0, { immediate: true });
              SMSH.showNav?.();

              await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

              SMSH.heroRevealed = false;
              SMSH.heroAnimating = false;
              initPageContainer(data.next.container);
            } catch {
              SMSH.isTransitioning = false;
              const fallbackHref = data?.next?.url?.href;
              if (fallbackHref) window.location.assign(fallbackHref);
            }
          },
          async enter(data) {
            try {
              const targetHash = SMSH.pendingHash || window.location.hash || '';
              SMSH.pendingHash = '';
              const resolved = targetHash ? resolveHashTarget(data.next.container, targetHash) : null;

              if (resolved) {
                triggerPageHeroEntrance(data.next.container, { immediate: true });
                ScrollTrigger.refresh();
                const destY = Math.max(0, Math.round(resolved.getBoundingClientRect().top + window.scrollY));
                window.scrollTo(0, destY);
                SMSH.lenis?.scrollTo(destY, { immediate: true });
                ScrollTrigger.update();
                attachNavDarkTriggers(data.next.container);
                prepareSectionEntrance(resolved);
              }

              await playLiquidRevealOut(() => {
                if (resolved) {
                  playSectionEntrance(resolved);
                } else {
                  triggerPageHeroEntrance(data.next.container);
                }
              });
            } finally {
              ScrollTrigger.refresh();
              SMSH.lenis?.start();
              SMSH.isTransitioning = false;
            }
          },
        },
      ],
    });

    if (window.barba.hooks) {
      window.barba.hooks.after(() => {
        SMSH.isTransitioning = false;
      });
    }
  }

  /* ------------------------------------------------------------------------
     6. GLOBAL TRAILING INGREDIENT PILL CURSOR (#ingredient-cursor-trail)
     ------------------------------------------------------------------------ */
  function initIngredientCursor() {
    const trailRoot = document.getElementById('ingredient-cursor-trail');
    const pathEl = document.getElementById('cursor-trail-path');
    const nodes = gsap.utils.toArray('#ingredient-cursor-trail .cursor-trail-node');

    if (
      !trailRoot ||
      !nodes.length ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const segmentLength = 8;
    const segmentCount = 8;
    const knots = [0, 3, 5, 7];

    const pointer = {
      x: null,
      y: null,
      hasMoved: false,
      hidden: false,
      awake: false,
    };

    const segLenState = { value: segmentLength };
    const visState = { value: 0 };
    let idleTimer = null;
    let rope = [];

    gsap.set(nodes, { xPercent: -50, yPercent: -50, opacity: 0 });

    const syncVisibility = (targetHidden) => {
      gsap.to(visState, {
        value: targetHidden ? 0 : 1,
        duration: 0.6,
        overwrite: 'auto',
        ease: 'power3.inOut',
        onUpdate: () => {
          const v = visState.value;
          trailRoot.style.opacity = String(v);
          trailRoot.style.zIndex = v < 0.2 ? '0' : '10000';
          nodes.forEach((n) => {
            n.style.opacity = String(v);
          });
        },
      });
    };

    window.addEventListener(
      'mousemove',
      (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.awake = true;

        if (!pointer.hasMoved) {
          pointer.hasMoved = true;
          rope = Array.from({ length: segmentCount }, () => ({ x: pointer.x, y: pointer.y }));
          segLenState.value = segmentLength;
          gsap.set(nodes, { x: pointer.x, y: pointer.y });
          syncVisibility(pointer.hidden);
        }

        gsap.to(segLenState, {
          value: segmentLength,
          duration: 0.01,
          ease: 'power4.inOut',
          overwrite: true,
        });

        if (idleTimer) window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => {
          gsap.to(segLenState, {
            value: 0,
            duration: 0.5,
            ease: 'expo.out',
            overwrite: true,
          });
        }, 0);

        const hitEl = document.elementFromPoint(pointer.x, pointer.y);
        let shouldHide = false;
        let cur = hitEl;
        while (cur) {
          if (cur.getAttribute && cur.getAttribute('data-cursor-hide') !== null) {
            shouldHide = true;
            break;
          }
          cur = cur.parentElement;
        }

        if (shouldHide !== pointer.hidden) {
          pointer.hidden = shouldHide;
          syncVisibility(shouldHide);
        }
      },
      { passive: true }
    );

    gsap.ticker.add(() => {
      if (!pointer.hasMoved || !pointer.awake || pointer.x === null || !rope.length) return;

      gsap.to(rope[0], {
        x: pointer.x,
        y: pointer.y,
        duration: 0.05,
        ease: 'power2.out',
        overwrite: true,
      });

      const maxDist = Math.max(0, segLenState.value ?? segmentLength);
      let maxDelta = Math.hypot(pointer.x - rope[0].x, pointer.y - rope[0].y);
      for (let r = 1; r < segmentCount; r += 1) {
        const prev = rope[r - 1];
        const curr = rope[r];
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDelta) maxDelta = dist;
        if (dist > maxDist) {
          const angle = Math.atan2(dy, dx);
          const tx = prev.x - Math.cos(angle) * maxDist;
          const ty = prev.y - Math.sin(angle) * maxDist;
          gsap.to(curr, {
            x: tx,
            y: ty,
            duration: 0.12 + 0.01 * r,
            ease: 'power3.out',
            overwrite: true,
          });
        }
      }

      if (pathEl && rope.length >= 2) {
        let d = `M ${rope[0].x.toFixed(1)} ${rope[0].y.toFixed(1)}`;
        for (let r = 1; r < segmentCount - 1; r += 1) {
          const mx = ((rope[r].x + rope[r + 1].x) * 0.5).toFixed(1);
          const my = ((rope[r].y + rope[r + 1].y) * 0.5).toFixed(1);
          d += ` Q ${rope[r].x.toFixed(1)} ${rope[r].y.toFixed(1)} ${mx} ${my}`;
        }
        const last = rope[segmentCount - 1];
        d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
        pathEl.setAttribute('d', d);
      }

      knots.forEach((knotIdx, idx) => {
        const node = nodes[idx];
        const clamped = Math.max(0, Math.min(segmentCount - 1, knotIdx));
        const pt = rope[clamped];
        if (!node || !pt) return;
        gsap.set(node, { x: pt.x, y: pt.y });
        const prevPt = rope[Math.max(0, Math.min(segmentCount - 1, knotIdx - 1))];
        if (prevPt && (pt.x !== prevPt.x || pt.y !== prevPt.y)) {
          const deg = Math.atan2(pt.y - prevPt.y, pt.x - prevPt.x) * (180 / Math.PI);
          gsap.set(node, { rotation: deg });
        }
      });

      if (maxDist <= 0.05 && maxDelta <= 0.2) {
        pointer.awake = false;
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. NAVBAR (AUTO-HIDE + DARK-SECTION ADAPTIVE), POPOVER & SMART LINKS
     ------------------------------------------------------------------------ */
  function attachNavDarkTriggers(container) {
    SMSH.navDarkTriggers.forEach((st) => st.kill());
    SMSH.navDarkTriggers = [];
    SMSH.isDarkNav = false;

    const darkSections = container.querySelectorAll('[data-nav-dark="true"]');
    darkSections.forEach((sec) => {
      const st = ScrollTrigger.create({
        trigger: sec,
        start: 'top 5%',
        end: 'bottom 5%',
        onEnter: () => {
          SMSH.isDarkNav = true;
          SMSH.syncToggleTheme?.();
        },
        onEnterBack: () => {
          SMSH.isDarkNav = true;
          SMSH.syncToggleTheme?.();
        },
        onLeave: () => {
          SMSH.isDarkNav = false;
          SMSH.syncToggleTheme?.();
        },
        onLeaveBack: () => {
          SMSH.isDarkNav = false;
          SMSH.syncToggleTheme?.();
        },
      });
      SMSH.navDarkTriggers.push(st);
    });

    // Ensure initial viewport dark check applies immediately
    if (darkSections.length) {
      const firstRect = darkSections[0].getBoundingClientRect();
      if (firstRect.top <= window.innerHeight * 0.06 && firstRect.bottom >= window.innerHeight * 0.06) {
        SMSH.isDarkNav = true;
      }
    }
    SMSH.syncToggleTheme?.();
  }

  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggleBtn = document.getElementById('menu-toggle');
    const burgersPill = document.getElementById('nav-burgers-pill');
    const toggleLabel = document.getElementById('menu-toggle-label');
    const toggleTextSpans = toggleLabel ? toggleLabel.querySelectorAll('.split-link > span') : [];
    const menuEl = document.getElementById('main-menu');
    const backdrop = document.getElementById('menu-backdrop');
    const bar1 = document.getElementById('menu-bar-1');
    const bar2 = document.getElementById('menu-bar-2');
    const bar3 = document.getElementById('menu-bar-3');
    const menuLinks = gsap.utils.toArray('.menu-item-link');

    if (!toggleBtn || !menuEl || !backdrop) return;

    let isNavVisible = true;
    let lastScroll = window.scrollY || 0;

    function syncToggleTheme() {
      const open = SMSH.isMenuOpen;
      const dark = SMSH.isDarkNav;

      toggleBtn.classList.toggle('bg-red', open);
      toggleBtn.classList.toggle('border-red', open);
      toggleBtn.classList.toggle('bg-transparent', !open);

      toggleBtn.classList.toggle('border-white/20', !open && dark);
      toggleBtn.classList.toggle('hover:border-white', !open && dark);
      toggleBtn.classList.toggle('border-black/20', !open && !dark);
      toggleBtn.classList.toggle('hover:border-black', !open && !dark);

      if (toggleLabel) {
        toggleLabel.classList.toggle('text-beige', open);
        toggleLabel.classList.toggle('text-white', !open && dark);
        toggleLabel.classList.toggle('text-black', !open && !dark);
      }

      toggleTextSpans.forEach((s) => {
        s.textContent = open ? 'Close' : 'Menu';
      });

      [bar1, bar2, bar3].filter(Boolean).forEach((bar) => {
        bar.classList.toggle('bg-beige', open);
        bar.classList.toggle('bg-white', !open && dark);
        bar.classList.toggle('bg-black', !open && !dark);
      });

      if (burgersPill) {
        burgersPill.classList.toggle('border-white/40', dark);
        burgersPill.classList.toggle('border-transparent', !dark);
      }
    }

    SMSH.syncToggleTheme = syncToggleTheme;

    if (navbar && SMSH.lenis) {
      gsap.set(navbar, { willChange: 'transform' });
      const showNav = () => {
        lastScroll = window.scrollY || 0;
        if (!isNavVisible) {
          isNavVisible = true;
          gsap.to(navbar, { y: 0, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
        }
      };
      SMSH.showNav = showNav;
      const hideNav = () => {
        if (isNavVisible) {
          isNavVisible = false;
          const h = navbar.offsetHeight || 0;
          gsap.to(navbar, { y: -(h + 12), duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
        }
      };

      SMSH.lenis.on('scroll', ({ scroll }) => {
        if (SMSH.isMenuOpen || SMSH.isTransitioning) {
          showNav();
          lastScroll = scroll;
          return;
        }
        const isPhone = window.innerWidth < 768;
        const delta = scroll - lastScroll;
        if (scroll < (isPhone ? 45 : 10)) {
          showNav();
        } else if (delta > (isPhone ? 16 : 6)) {
          hideNav();
        } else if (delta < (isPhone ? -4 : -6)) {
          showNav();
        }
        lastScroll = scroll;
      });
    }

    function openMenu() {
      SMSH.isMenuOpen = true;
      toggleBtn.setAttribute('aria-expanded', 'true');
      menuEl.style.pointerEvents = 'auto';
      backdrop.style.pointerEvents = 'auto';
      syncToggleTheme();
      SMSH.lenis?.stop();

      if (navbar && !isNavVisible) {
        isNavVisible = true;
        gsap.to(navbar, { y: 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      }

      gsap.killTweensOf([menuEl, backdrop, bar1, bar2, bar3, ...menuLinks]);

      gsap.to(backdrop, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.to(menuEl, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.8)', force3D: true });
      gsap.fromTo(
        menuLinks,
        { y: 10, opacity: 0, force3D: true },
        { y: 0, opacity: 1, duration: 0.22, stagger: 0.02, ease: 'power3.out', force3D: true, clearProps: 'transform' }
      );

      gsap.to(bar1, { top: '50%', yPercent: -50, rotation: 45, duration: 0.24, ease: 'power3.inOut' });
      gsap.to(bar2, { opacity: 0, scaleX: 0, duration: 0.18, ease: 'power3.inOut' });
      gsap.to(bar3, { bottom: 'auto', top: '50%', yPercent: -50, rotation: -45, duration: 0.24, ease: 'power3.inOut' });
    }

    function closeMenu(resumeScroll = true) {
      if (!SMSH.isMenuOpen) return;
      SMSH.isMenuOpen = false;
      toggleBtn.setAttribute('aria-expanded', 'false');
      menuEl.style.pointerEvents = 'none';
      backdrop.style.pointerEvents = 'none';
      syncToggleTheme();
      if (resumeScroll) SMSH.lenis?.start();

      gsap.killTweensOf([menuEl, backdrop, bar1, bar2, bar3]);

      gsap.to(backdrop, { opacity: 0, duration: 0.28, ease: 'power2.inOut' });
      gsap.to(menuEl, { opacity: 0, scale: 0.3, duration: 0.3, ease: 'power3.in' });

      gsap.to(bar1, { top: '0%', yPercent: 0, rotation: 0, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(bar2, { opacity: 1, scaleX: 1, duration: 0.3, delay: 0.05, ease: 'power3.inOut' });
      gsap.to(bar3, { top: 'auto', bottom: '0%', yPercent: 0, rotation: 0, duration: 0.35, ease: 'power3.inOut' });
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (SMSH.isMenuOpen) closeMenu();
      else openMenu();
    });

    backdrop.addEventListener('click', () => closeMenu());

    document.addEventListener('click', (e) => {
      if (SMSH.isMenuOpen && !menuEl.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && SMSH.isMenuOpen) {
        closeMenu();
      }
    });

    // Handle same-page clicks cleanly while Barba handles cross-page transitions
    document.addEventListener('click', (e) => {
      const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!link) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;

      let targetUrl;
      try {
        targetUrl = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (targetUrl.origin !== window.location.origin) return;

      const curPath = normalizePath(window.location.pathname);
      const nextPath = normalizePath(targetUrl.pathname);

      if (curPath === nextPath) {
        e.preventDefault();
        runSamePageLiquidTransition(targetUrl, link);
      }
    });

    SMSH.closeMenu = closeMenu;
  }

  /* ------------------------------------------------------------------------
     8. SHARED INTERACTIVE SYSTEMS (BLOB BUTTONS, PEEL STICKERS, ABOUT, JELLY)
     ------------------------------------------------------------------------ */
  const BLOB_BASE_NUMS = [
    310.777, 0.20434,
    424.154, 2.91791, 540.733, 50.9739, 574.176, 159.34,
    606.479, 264.014, 533.962, 365.999, 442.064, 425.623,
    364.995, 475.626, 270.863, 455.893, 193.524, 406.309,
    93.8313, 342.395, -27.3608, 259.503, 5.48889, 145.729,
    40.0621, 25.9857, 186.179, -2.77783, 310.777, 0.20434,
  ];

  // Exact 5-cubic-segment (32-number) equivalents of Module 23057's 3 organic hover shapes (ei[0..2])
  const BLOB_HOVER_SHAPES = [
    [
      302, 27,
      437, -2, 587, 97, 559, 201,
      545.5, 254.5, 513.25, 317.5, 466.625, 363.875,
      420, 410.25, 359, 440, 288, 427,
      193, 410, 66, 363, 41, 273,
      6, 146, 186, 48, 302, 27,
    ],
    [
      295, 50,
      400, 0, 593, 84, 562, 172,
      540.5, 232, 499.75, 302.25, 444.125, 353.125,
      388.5, 404, 318, 435.5, 237, 418,
      138, 397, 61, 324, 41, 233,
      20, 140, 184, 58, 295, 50,
    ],
    [
      326, 0,
      491, 34, 591, 147, 525, 255,
      488.5, 314, 443.5, 367.25, 389.75, 397.875,
      336, 428.5, 273.5, 436.5, 202, 405,
      131, 369, 34, 297, 35, 201,
      37, 77, 186, -10, 326, 0,
    ],
  ];

  function formatBlobPath(nums) {
    let d = `M${nums[0].toFixed(2)} ${nums[1].toFixed(2)}`;
    for (let i = 2; i < 32; i += 6) {
      d += `C${nums[i].toFixed(2)} ${nums[i + 1].toFixed(2)} ${nums[i + 2].toFixed(2)} ${nums[i + 3].toFixed(2)} ${nums[i + 4].toFixed(2)} ${nums[i + 5].toFixed(2)}`;
    }
    return `${d}Z`;
  }

  function initOrganicButtons(container) {
    container.querySelectorAll('[data-anm-btn="btn"]').forEach((btn) => {
      const path = btn.querySelector('[data-anm-btn="path"]');
      if (!path) return;

      const current = BLOB_BASE_NUMS.slice();
      let morphTween = null;

      const animateToShape = (targetNums, ease) => {
        if (morphTween) morphTween.kill();
        const startNums = current.slice();
        const proxy = { t: 0 };
        morphTween = gsap.to(proxy, {
          t: 1,
          duration: 0.5,
          ease,
          onUpdate: () => {
            const p = proxy.t;
            for (let i = 0; i < 32; i++) {
              current[i] = startNums[i] + (targetNums[i] - startNums[i]) * p;
            }
            path.setAttribute('d', formatBlobPath(current));
          },
        });
      };

      btn.addEventListener('mouseenter', () => {
        const shape = BLOB_HOVER_SHAPES[Math.floor(Math.random() * BLOB_HOVER_SHAPES.length)];
        animateToShape(shape, 'back.out(1.7)');
      });

      btn.addEventListener('mouseleave', () => {
        animateToShape(BLOB_BASE_NUMS, 'back.in(1.4)');
      });
    });
  }

  function initPeelStickers(container) {
    const pointLight = document.querySelector('#pointLight fePointLight');
    const pointLightFlipped = document.querySelector('#pointLightFlipped fePointLight');
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const simpleMode = isCoarse || isSafari;

    container.querySelectorAll('.sticker-wrapper').forEach((wrapper) => {
      const stickerContainer = wrapper.querySelector('.sticker-container') || wrapper;
      if (simpleMode) wrapper.classList.add('simple-effects');
      let isHovered = false;
      const scrollState = { peel: 0 };

      gsap.set(wrapper, { '--peel-amount': 0 });

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top 95%',
        end: 'top 58%',
        scrub: 1,
        onUpdate: (self) => {
          scrollState.peel = simpleMode ? 0 : (1 - self.progress) * 0.25;
          if (!isHovered) {
            wrapper.style.setProperty('--peel-amount', scrollState.peel.toFixed(3));
          }
        },
      });
      addPageCleanup(() => st.kill());

      wrapper.addEventListener('mouseenter', () => {
        isHovered = true;
        if (simpleMode) return;
        gsap.to(wrapper, { '--peel-amount': 0.3, duration: 0.38, ease: 'power2.out', overwrite: 'auto' });
      });

      wrapper.addEventListener('mouseleave', () => {
        isHovered = false;
        gsap.to(wrapper, { '--peel-amount': 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
      });

      wrapper.addEventListener('pointerdown', () => {
        isHovered = true;
        if (simpleMode) return;
        gsap.to(wrapper, { '--peel-amount': 0.4, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
      });

      wrapper.addEventListener('pointerup', () => {
        if (simpleMode) return;
        gsap.to(wrapper, { '--peel-amount': 0.3, duration: 0.35, ease: 'back.out(1.6)', overwrite: 'auto' });
      });

      if (!simpleMode && (pointLight || pointLightFlipped)) {
        const onMove = (e) => {
          const rect = stickerContainer.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          if (pointLight) gsap.set(pointLight, { attr: { x, y } });
          if (pointLightFlipped) gsap.set(pointLightFlipped, { attr: { x, y: rect.height - y } });
        };
        stickerContainer.addEventListener('mousemove', onMove, { passive: true });
        addPageCleanup(() => stickerContainer.removeEventListener('mousemove', onMove));
      }
    });
  }

  function initAboutMediaCards(container) {
    const stage = container.querySelector('#about-media-stage');
    const cards = gsap.utils.toArray('#about-media-stage .media-item', container);
    if (!stage || !cards.length) return;

    cards.forEach((card, idx) => {
      const img = card.querySelector('img');
      if (!img) return;

      gsap.fromTo(
        img,
        { scale: 1.18, opacity: 0 },
        {
          scale: 1.03,
          opacity: 1,
          duration: 1.05,
          delay: idx * 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: stage, start: 'top 95%', toggleActions: 'play none none none' },
        }
      );
    });

    if (window.matchMedia('(pointer: coarse)').matches) return;

    let lastX = 0,
      lastY = 0,
      vx = 0,
      vy = 0;

    const onMove = (e) => {
      vx = e.clientX - lastX;
      vy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    addPageCleanup(() => window.removeEventListener('mousemove', onMove));

    cards.forEach((card, idx) => {
      const getRestRotate = () =>
        window.innerWidth < 768 ? (idx === 0 ? -12 : idx === 2 ? 12 : 0) : parseFloat(card.getAttribute('data-base-rotate') || '0');

      card.addEventListener('mouseenter', () => {
        const restRot = getRestRotate();
        gsap.to(card, {
          x: gsap.utils.clamp(-42, 42, vx * 1.8),
          y: gsap.utils.clamp(-32, 32, vy * 1.6 - 10),
          rotation: restRot + gsap.utils.clamp(-10, 10, vx * 0.35),
          scale: 1.05,
          duration: 0.38,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: getRestRotate(),
          scale: 1,
          duration: 0.9,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        });
      });
    });
  }

  function initJellyWaves(container) {
    container.querySelectorAll('[data-jelly-svg="true"]').forEach((svg) => {
      const path = svg.querySelector('[data-jelly-path="true"]');
      const flip = svg.getAttribute('data-jelly-flip') === 'true';
      const deep = svg.getAttribute('data-jelly-deep') === 'true';

      if (path) {
        const state = flip
          ? { v: 165, s1c: 235, s1e: 145, s2c: 195, s2e: 163, s3c: 195, s3e: 195 }
            : deep
              ? { v: 108, s1c: 18, s1e: 138, s2c: 225, s2e: 138, s3c: 32, s3e: 102 }
              : { v: 135, s1c: 65, s1e: 155, s2c: 105, s2e: 137, s3c: 105, s3e: 105 };

        const buildPath = () =>
          flip
            ? `M1536,300 H-1 V${(300 - state.v).toFixed(1)} S184.32,${(300 - state.s1c).toFixed(1)} 460.8,${(300 - state.s1e).toFixed(1)} S860.16,${(300 - state.s2c).toFixed(1)} 1121.28,${(300 - state.s2e).toFixed(1)} S1413.12,${(300 - state.s3c).toFixed(1)} 1536,${(300 - state.s3e).toFixed(1)} V300`
            : `M1536,0 H-1 V${state.v.toFixed(1)} S184.32,${state.s1c.toFixed(1)} 460.8,${state.s1e.toFixed(1)} S860.16,${state.s2c.toFixed(1)} 1121.28,${state.s2e.toFixed(1)} S1413.12,${state.s3c.toFixed(1)} 1536,${state.s3e.toFixed(1)} V0`;

        const update = () => path.setAttribute('d', buildPath());
        const waveTl = gsap.timeline({ repeat: -1, yoyo: true });

        if (flip) {
          waveTl
            .to(state, { v: 145, s1c: 215, s1e: 155, duration: 1, ease: 'sine.inOut', onUpdate: update }, 0)
            .to(state, { s2c: 175, s2e: 140, duration: 2, ease: 'sine.inOut', onUpdate: update }, 0.3)
            .to(state, { s3c: 170, s3e: 200, duration: 1.8, ease: 'sine.inOut', onUpdate: update }, 0.6);
        } else if (deep) {
          waveTl
            .to(state, { v: 128, s1c: 36, s1e: 122, duration: 1.1, ease: 'sine.inOut', onUpdate: update }, 0)
            .to(state, { s2c: 205, s2e: 150, duration: 2, ease: 'sine.inOut', onUpdate: update }, 0.3)
            .to(state, { s3c: 48, s3e: 88, duration: 1.8, ease: 'sine.inOut', onUpdate: update }, 0.6);
        } else {
          waveTl
            .to(state, { v: 155, s1c: 45, s1e: 175, duration: 1, ease: 'sine.inOut', onUpdate: update }, 0)
            .to(state, { s2c: 85, s2e: 160, duration: 2, ease: 'sine.inOut', onUpdate: update }, 0.3)
            .to(state, { s3c: 130, s3e: 80, duration: 1.8, ease: 'sine.inOut', onUpdate: update }, 0.6);
        }
        addPageCleanup(() => waveTl.kill());
        if ('IntersectionObserver' in window) {
          const io = new IntersectionObserver(
            (entries) => {
              if (entries[0]?.isIntersecting) waveTl.play();
              else waveTl.pause();
            },
            { rootMargin: '150px 0px' }
          );
          io.observe(svg);
          addPageCleanup(() => io.disconnect());
        }
      }

      gsap.set(svg, { transformOrigin: flip ? 'bottom center' : 'top center' });
      const mm = ScrollTrigger.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.to(svg, {
          scaleY: deep ? 1.18 : 1.5,
          scrollTrigger: {
            trigger: svg,
            start: flip ? 'bottom 80%' : 'top 80%',
            end: flip ? 'top 20%' : 'bottom 20%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
      mm.add('(max-width: 767px)', () => {
        gsap.to(svg, {
          scaleY: deep ? 1.12 : 1.2,
          scrollTrigger: {
            trigger: svg,
            start: flip ? 'bottom 95%' : 'top 90%',
            end: flip ? 'top 15%' : 'bottom 10%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      });
      addPageCleanup(() => mm.revert());
    });
  }

  function initExperience(container) {
    const rotors = gsap.utils.toArray('[data-eye-rotor="true"]', container);
    if (rotors.length) {
      gsap.set(rotors, { xPercent: -50, yPercent: -50, rotation: 0, transformOrigin: '50% 50%' });

      if (!window.matchMedia('(pointer: coarse)').matches) {
        const setters = rotors.map((r) => gsap.quickSetter(r, 'rotation', 'deg'));
        const onMove = (e) => {
          const dx = e.clientX - window.innerWidth / 2;
          const dy = e.clientY - window.innerHeight / 2;
          const deg = (180 / Math.PI) * Math.atan2(dy, dx) - 180;
          setters.forEach((set) => set(deg));
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        addPageCleanup(() => window.removeEventListener('mousemove', onMove));
      }
    }

    const frame = container.querySelector('#cheesy-frame');
    const img = container.querySelector('#cheesy-img');
    if (frame && img) {
      gsap.fromTo(
        img,
        { scale: 1.12, yPercent: -5 },
        {
          scale: 1.12,
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        }
      );
    }
  }

  function initIngredients(container) {
    const section = container.querySelector('#ingredients');
    const items = gsap.utils.toArray('#ingredients [data-ing="true"]', container);
    if (!section || !items.length || !SMSH.lenis) return;

    const specs = items.map((el) => ({
      el,
      factor: parseFloat(el.getAttribute('data-factor') || '0'),
    }));

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = window.innerHeight - rect.top;
      if (progress > 0 && rect.bottom > 0) {
        for (const s of specs) {
          s.el.style.transform = `translate3d(0, ${(progress * s.factor).toFixed(2)}px, 0)`;
        }
      }
    };

    const unsub = SMSH.lenis.on('scroll', onScroll);
    if (typeof unsub === 'function') addPageCleanup(unsub);
  }

  function initMap(container) {
    const desktopStage = container.querySelector('#map-desktop-stage');
    const path = container.querySelector('#map-flight-path');
    const plane = container.querySelector('#map-plane');
    const desktopCards = gsap.utils.toArray('[data-map-card="true"]', container);
    const desktopLabels = gsap.utils.toArray('#map-desktop .country-label', container);

    const mobileStage = container.querySelector('#map-mobile-stage');
    const mobilePath = container.querySelector('#map-mobile-path');
    const mobilePlanes = gsap.utils.toArray('[data-mobile-plane="true"]', container);
    const mobileCards = gsap.utils.toArray('[data-map-mobile-card="true"]', container);

    const mm = gsap.matchMedia();
    addPageCleanup(() => mm.revert());

    mm.add('(min-width: 768px)', () => {
      if (!desktopStage) return;
      const thresholds = [0.14, 0.28, 0.5, 0.68, 0.91];
      const shown = new Array(desktopCards.length).fill(false);

      desktopCards.forEach((card) => {
        gsap.set(card, { opacity: 0, scale: 0.8, rotate: 0, force3D: true });
      });

      const scrollCfg = {
        trigger: desktopStage,
        start: '-6% top',
        end: '82%',
        scrub: 1,
        invalidateOnRefresh: true,
      };

      const planeScrollCfg = {
        trigger: desktopStage,
        start: 'top top',
        end: 'bottom 25%',
        scrub: 1,
        invalidateOnRefresh: true,
      };

      ScrollTrigger.create({
        ...scrollCfg,
        onUpdate: (self) => {
          const p = self.progress;
          thresholds.forEach((th, idx) => {
            const card = desktopCards[idx];
            if (!card) return;
            if (p >= th && !shown[idx]) {
              gsap.fromTo(
                card,
                { opacity: 0, scale: 0.8, rotate: -15 + 30 * Math.random() },
                { opacity: 1, scale: 1.08, rotate: 5 - 10 * Math.random(), duration: 0.45, ease: 'back.out(2.2)', overwrite: 'auto', force3D: true }
              );
              shown[idx] = true;
            } else if (p < th && shown[idx]) {
              gsap.to(card, { opacity: 0, scale: 0.8, rotate: -15 + 30 * Math.random(), duration: 0.28, ease: 'back.in(1.2)', overwrite: 'auto', force3D: true });
              shown[idx] = false;
            }
          });
        },
      });

      if (plane && path) {
        gsap.set(plane, { xPercent: -50, yPercent: -50, force3D: true });
        gsap.to(plane, {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: -90 },
          ease: 'none',
          force3D: true,
          scrollTrigger: { ...planeScrollCfg },
        });
      }

      if (!window.matchMedia('(pointer: coarse)').matches) {
        const attachVelocitySpring = (els, restScale) => {
          els.forEach((el) => {
            const restRot = parseFloat(gsap.getProperty(el, 'rotation')) || 0;
            let lx = 0,
              ly = 0,
              vx = 0,
              vy = 0;

            el.addEventListener('mouseenter', (e) => {
              vx = 0;
              vy = 0;
              lx = e.clientX;
              ly = e.clientY;
            });
            el.addEventListener(
              'mousemove',
              (e) => {
                vx = e.clientX - lx;
                vy = e.clientY - ly;
                lx = e.clientX;
                ly = e.clientY;
              },
              { passive: true }
            );
            el.addEventListener('mouseleave', () => {
              gsap
                .timeline({ overwrite: 'auto' })
                .to(el, {
                  x: gsap.utils.clamp(-36, 36, vx * 1.4),
                  y: gsap.utils.clamp(-28, 28, vy * 1.4),
                  rotation: restRot + gsap.utils.clamp(-10, 10, vx * 0.35),
                  duration: 0.22,
                  ease: 'power2.out',
                  force3D: true,
                })
                .to(el, {
                  x: 0,
                  y: 0,
                  rotation: restRot,
                  scale: restScale,
                  duration: 0.85,
                  ease: 'elastic.out(1, 0.45)',
                  force3D: true,
                });
            });
          });
        };

        attachVelocitySpring(desktopCards, 1.08);
        attachVelocitySpring(desktopLabels, 1);
      }
    });

    mm.add('(max-width: 767px)', () => {
      if (!mobileStage) return;
      mobileCards.forEach((card) => {
        gsap.set(card, { opacity: 0, scale: 0.8, rotate: 0, y: 50 });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              card,
              { opacity: 0, scale: 0.8, rotate: -15 + 30 * Math.random(), y: 50 },
              { opacity: 1, scale: 1.05, rotate: 3 - 6 * Math.random(), y: 0, duration: 0.45, ease: 'back.out(2.2)', overwrite: 'auto' }
            );
          },
        });
      });

      if (mobilePath && mobilePlanes.length) {
        const count = mobilePlanes.length;
        gsap.set(mobilePlanes, { xPercent: -50, yPercent: -50, opacity: 0 });
        const segTl = gsap.timeline({
          scrollTrigger: { trigger: mobileStage, start: '-2% center', end: '95% center', scrub: 1, invalidateOnRefresh: true },
        });

        for (let t = 0; t < count; t++) {
          const at = t * 1;
          segTl.fromTo(
            mobilePlanes[t],
            { motionPath: { path: mobilePath, align: mobilePath, alignOrigin: [0.5, 0.5], autoRotate: true, start: t / count, end: t / count } },
            { motionPath: { path: mobilePath, align: mobilePath, alignOrigin: [0.5, 0.5], autoRotate: true, start: t / count, end: (t + 1) / count }, duration: 1, ease: 'none' },
            at
          );
          segTl.fromTo(mobilePlanes[t], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, at);
          segTl.to(mobilePlanes[t], { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, at + 0.8);
        }
      }
    });
  }

  function initCtaAndFooter(container) {
    const photo = container.querySelector('#cta-photo');
    if (photo) {
      gsap.from(photo, {
        opacity: 0,
        scale: 1.08,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: photo, start: 'top 90%', toggleActions: 'play none none none' },
      });
    }

    container.querySelectorAll('[data-footer-line]').forEach((line) => {
      const origin = line.getAttribute('data-footer-line') === 'center' ? '50% 50%' : '0% 50%';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(line, { scaleX: 1, transformOrigin: origin });
        return;
      }
      gsap.set(line, { scaleX: 0, transformOrigin: origin });
      gsap.to(line, {
        scaleX: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: line, start: 'top 94%', once: true },
      });
    });

    const footer = container.querySelector('#footer');
    const items = gsap.utils.toArray('#footer [data-juggle="true"]', container);
    if (!footer || !items.length) return;

    const cfgDesktop = { restVH: 22, apex: [38, 60], driftStart: [2, 7], driftEnd: [8, 24], upDur: [0.9, 1.3], gravityRatio: [1.15, 1.5], spin: [220, 600], repeatDelay: [0.2, 0.9], staggerStart: 0.55, sizeScale: 1 };
    const cfgMobile = { restVH: 8, apex: [12, 18], driftStart: [1, 3], driftEnd: [5, 10], upDur: [0.7, 0.95], gravityRatio: [1.08, 1.18], spin: [80, 180], repeatDelay: [0.12, 0.38], staggerStart: 0.4, sizeScale: 1.29 };
    const reducedDesktop = [{ y: -14, x: -2, rotation: -10 }, { y: -10, x: 1, rotation: 8 }, { y: -16, x: -1, rotation: -4 }, { y: -12, x: 2, rotation: 12 }];
    const reducedMobile = [{ y: -7, x: -1, rotation: -8 }, { y: -5, x: 1, rotation: 6 }, { y: -8, x: 0, rotation: -3 }, { y: -6, x: 1, rotation: 9 }];

    const mm = gsap.matchMedia(footer);
    mm.add(
      { isDesktop: '(min-width: 769px)', isMobile: '(max-width: 768px)', reduceMotion: '(prefers-reduced-motion: reduce)' },
      (context) => {
        const { isMobile, reduceMotion } = context.conditions;
        const cfg = isMobile ? cfgMobile : cfgDesktop;
        footer.style.setProperty('--juggle-scale', String(cfg.sizeScale));

        const activeTimelines = new Set();
        gsap.set(items, { xPercent: -50, x: 0, y: `${cfg.restVH}vh`, rotation: 0, opacity: 0, scale: 0.9, transformOrigin: '50% 50%', force3D: true });

        if (reduceMotion) {
          const poses = isMobile ? reducedMobile : reducedDesktop;
          items.forEach((el, idx) => {
            const pose = poses[idx] || poses[poses.length - 1];
            gsap.fromTo(
              el,
              { x: `${pose.x}vw`, y: `${0.5 * pose.y}vh`, rotation: pose.rotation, opacity: 0, scale: 0.85 },
              { x: `${pose.x}vw`, y: `${pose.y}vh`, rotation: pose.rotation, opacity: 1, scale: 1, duration: 0.7, delay: 0.12 * idx, ease: 'power2.out' }
            );
          });
          return;
        }

        let disposed = false;
        const pendingCalls = [];
        const launch = (el) => {
          if (disposed) return;
          const apex = gsap.utils.random(...cfg.apex);
          const dir = Math.random() > 0.5 ? 1 : -1;
          const driftStart = -(gsap.utils.random(...cfg.driftStart) * dir);
          const driftEnd = gsap.utils.random(...cfg.driftEnd) * dir;
          const upDur = gsap.utils.random(...cfg.upDur);
          const downDur = upDur * gsap.utils.random(...cfg.gravityRatio);
          const totalDur = upDur + downDur;
          const spin = gsap.utils.random(...cfg.spin) * (Math.random() > 0.5 ? 1 : -1);
          const wait = gsap.utils.random(...cfg.repeatDelay);

          gsap.set(el, { x: `${driftStart}vw`, y: `${cfg.restVH}vh`, rotation: 0, opacity: 0, scale: 0.9 });

          const tl = gsap.timeline({
            defaults: { overwrite: 'auto' },
            onComplete: () => {
              activeTimelines.delete(tl);
              if (!disposed) pendingCalls.push(gsap.delayedCall(wait, () => launch(el)));
            },
          });
          activeTimelines.add(tl);

          tl.to(el, { opacity: 1, scale: 1, duration: 0.18, ease: 'power1.out' }, 0)
            .to(el, { y: `-${apex}vh`, duration: upDur, ease: 'power2.out' }, 0)
            .to(el, { y: `${cfg.restVH}vh`, duration: downDur, ease: 'power2.in' }, upDur)
            .to(el, { x: `${driftEnd}vw`, duration: totalDur, ease: 'sine.inOut' }, 0)
            .to(el, { rotation: spin, duration: totalDur, ease: 'none' }, 0)
            .to(el, { opacity: 0, duration: 0.25, ease: 'power1.in' }, totalDur - 0.25);
        };

        items.forEach((el, idx) => {
          const delay = idx * cfg.staggerStart + gsap.utils.random(0, 0.4);
          pendingCalls.push(gsap.delayedCall(delay, () => launch(el)));
        });

        const onVis = () => {
          if (document.hidden) activeTimelines.forEach((t) => t.pause());
          else activeTimelines.forEach((t) => t.play());
        };
        document.addEventListener('visibilitychange', onVis);

        return () => {
          disposed = true;
          document.removeEventListener('visibilitychange', onVis);
          pendingCalls.forEach((c) => c.kill());
          activeTimelines.forEach((t) => t.kill());
          activeTimelines.clear();
        };
      }
    );
  }

  /* ------------------------------------------------------------------------
     9. SUBPAGE ENGINES: CART SYSTEM, MENU PAGE, SPICES PAGE & CONTACT FORM
     ------------------------------------------------------------------------ */
  function initCartSystem() {
    const widget = document.getElementById('smsh-cart-widget');
    const toggle = document.getElementById('smsh-cart-toggle');
    const popover = document.getElementById('smsh-cart-popover');
    const badge = document.getElementById('smsh-cart-badge');
    const floatPlus = document.getElementById('smsh-cart-float-plus');
    const ringSlot = document.getElementById('smsh-cart-ring-slot');
    const countText = document.getElementById('smsh-cart-count-text');
    const totalEl = document.getElementById('smsh-cart-total');
    const itemsBox = document.getElementById('smsh-cart-items');
    const emptyMsg = document.getElementById('smsh-cart-empty-msg');
    const toast = document.getElementById('smsh-cart-toast');
    const toastImg = document.getElementById('smsh-toast-img');
    const toastText = document.getElementById('smsh-toast-text');
    const checkoutBtn = document.getElementById('smsh-checkout-btn');
    const modalBackdrop = document.getElementById('smsh-checkout-backdrop');
    const modal = document.getElementById('smsh-checkout-modal');
    const modalSummary = document.getElementById('smsh-checkout-summary');
    const modalClose = document.getElementById('smsh-checkout-close');
    const modalDone = document.getElementById('smsh-checkout-done');

    if (!widget || !toggle || !popover) return;

    let toastTimer = null;

    function openCart() {
      SMSH.cartOpen = true;
      toggle.setAttribute('aria-expanded', 'true');
      popover.style.pointerEvents = 'auto';
      gsap.to(popover, { opacity: 1, scale: 1, duration: 0.36, ease: 'back.out(1.6)', overwrite: 'auto' });
    }

    function closeCart() {
      SMSH.cartOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      popover.style.pointerEvents = 'none';
      gsap.to(popover, { opacity: 0, scale: 0.92, duration: 0.24, ease: 'power2.in', overwrite: 'auto' });
    }

    SMSH.openCart = openCart;
    SMSH.closeCart = closeCart;

    function refreshCartUI() {
      const totalQty = SMSH.cart.reduce((acc, it) => acc + it.qty, 0);
      const totalAmt = SMSH.cart.reduce((acc, it) => acc + it.qty * it.price, 0);

      widget.classList.toggle('hidden', SMSH.currentNamespace !== 'menu' && totalQty === 0);

      if (badge) badge.textContent = String(totalQty);
      if (countText) countText.textContent = String(totalQty);
      if (totalEl) totalEl.textContent = `$${totalAmt.toFixed(2)}`;
      if (checkoutBtn) checkoutBtn.disabled = totalQty === 0;
      if (emptyMsg) emptyMsg.style.display = totalQty === 0 ? 'block' : 'none';

      if (itemsBox) {
        if (totalQty === 0) {
          itemsBox.innerHTML =
            '<div class="rounded-[1vw] max-md:rounded-[4vw] bg-beige/10 border border-beige/15 px-[1vw] py-[.9vw] max-md:px-[4vw] max-md:py-[3.2vw]"><p class="font-mouse-memoirs uppercase text-[.95vw] max-md:text-[3.8vw] text-beige/80 tracking-wide">No items yet</p></div>';
        } else {
          itemsBox.innerHTML = SMSH.cart
            .map(
              (item) => `
              <div class="flex items-center justify-between gap-[.7vw] max-md:gap-[2.8vw] rounded-[1vw] max-md:rounded-[4vw] bg-beige/10 border border-beige/15 px-[.85vw] py-[.65vw] max-md:px-[3.5vw] max-md:py-[2.4vw]">
                ${item.img
                  ? `<img src="${item.img}" alt="" class="size-[2.5vw] max-lg:size-[4vw] max-md:size-[9.5vw] rounded-[.7vw] max-md:rounded-[2.5vw] bg-white/90 p-[.2vw] object-contain shrink-0" />`
                  : ''
                }
                <div class="min-w-0 flex-1">
                  <p class="font-mouse-memoirs uppercase text-[1vw] max-lg:text-[1.6vw] max-md:text-[4vw] text-beige truncate">${item.name}</p>
                  <p class="font-mouse-memoirs uppercase text-[.85vw] max-lg:text-[1.4vw] max-md:text-[3.4vw] text-mustard">$${(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-[.4vw] max-md:gap-[1.5vw] shrink-0">
                  <button type="button" data-cart-dec="${item.id}" class="size-[1.8vw] max-lg:size-[2.8vw] max-md:size-[7vw] rounded-full bg-black/25 hover:bg-mustard hover:text-black text-beige font-mouse-memoirs grid place-items-center cursor-pointer transition-colors" aria-label="Decrease ${item.name}">-</button>
                  <span class="font-mouse-memoirs text-[1vw] max-lg:text-[1.6vw] max-md:text-[4vw] w-[1.2vw] max-md:w-[5vw] text-center">${item.qty}</span>
                  <button type="button" data-cart-inc="${item.id}" class="size-[1.8vw] max-lg:size-[2.8vw] max-md:size-[7vw] rounded-full bg-black/25 hover:bg-mustard hover:text-black text-beige font-mouse-memoirs grid place-items-center cursor-pointer transition-colors" aria-label="Increase ${item.name}">+</button>
                </div>
              </div>`
            )
            .join('');
        }
      }
    }

    SMSH.refreshCartUI = refreshCartUI;

    function triggerCartLandingFeedback({ name, img }) {
      gsap.fromTo(toggle, { scale: 1.24 }, { scale: 1, duration: 0.5, ease: 'back.out(2.6)', overwrite: 'auto' });
      gsap.fromTo(badge, { scale: 0.65 }, { scale: 1, duration: 0.45, ease: 'back.out(2.8)', overwrite: 'auto' });

      if (ringSlot) {
        const ring = document.createElement('span');
        ring.className = 'cart-pulse-ring absolute inset-0 rounded-full border-2 border-mustard pointer-events-none';
        ringSlot.appendChild(ring);
        setTimeout(() => ring.remove(), 600);
      }

      if (floatPlus) {
        gsap.killTweensOf(floatPlus);
        gsap.fromTo(
          floatPlus,
          { y: 6, opacity: 1, scale: 0.8 },
          { y: -26, opacity: 0, scale: 1.15, duration: 0.72, ease: 'power2.out', overwrite: 'auto' }
        );
      }

      if (toast) {
        if (toastText) toastText.textContent = `Added ${name}`;
        else toast.textContent = `Added ${name}`;
        if (toastImg && img) {
          toastImg.src = img;
          toastImg.classList.remove('hidden');
        }
        toast.style.pointerEvents = 'auto';
        clearTimeout(toastTimer);
        gsap.to(toast, { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)', overwrite: 'auto' });
        toastTimer = setTimeout(() => {
          toast.style.pointerEvents = 'none';
          gsap.to(toast, { opacity: 0, x: 14, scale: 0.9, duration: 0.28, ease: 'power2.in', overwrite: 'auto' });
        }, 2300);
      }
    }

    function animateFlyToCart(triggerEl, imgSrc, onLand) {
      if (!triggerEl || !imgSrc || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        onLand?.();
        return;
      }

      const card = triggerEl.closest('[data-menu-card="true"], [data-flavor-dip="true"]');
      const sourceImgEl = (card && card.querySelector('.menu-burger-img img, .flavor-dip-img img, img')) || triggerEl;
      const srcRect = sourceImgEl.getBoundingClientRect();
      const targetRect = toggle.getBoundingClientRect();

      if (!srcRect.width || !targetRect.width) {
        onLand?.();
        return;
      }

      const startX = srcRect.left + srcRect.width / 2;
      const startY = srcRect.top + srcRect.height / 2;
      const endX = targetRect.left + targetRect.width / 2;
      const endY = targetRect.top + targetRect.height / 2;

      const size = Math.min(72, Math.max(46, srcRect.width * 0.42));
      const flyer = document.createElement('div');
      flyer.className = 'fixed rounded-full bg-white border-2 border-mustard shadow-2xl pointer-events-none flex items-center justify-center p-1';
      flyer.style.cssText = `left: 0; top: 0; width: ${size}px; height: ${size}px; z-index: 10002; will-change: transform, opacity;`;

      const imgNode = document.createElement('img');
      imgNode.src = imgSrc;
      imgNode.alt = '';
      imgNode.className = 'w-full h-full object-contain';
      flyer.appendChild(imgNode);
      document.body.appendChild(flyer);

      const midX = (startX + endX) / 2;
      const arcLift = Math.min(startY, endY) - Math.max(70, Math.abs(endX - startX) * 0.22);

      gsap.set(flyer, { xPercent: -50, yPercent: -50, x: startX, y: startY, scale: 0.85, opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          flyer.remove();
          onLand?.();
        },
      });

      tl.to(flyer, {
        x: midX,
        y: arcLift,
        scale: 1.15,
        rotation: -18,
        duration: 0.26,
        ease: 'power2.out',
      }).to(flyer, {
        x: endX,
        y: endY,
        scale: 0.25,
        rotation: 260,
        opacity: 0.85,
        duration: 0.3,
        ease: 'power2.in',
      });
    }

    function addToCart({ id, name, price, img }, triggerEl = null) {
      const found = SMSH.cart.find((c) => c.id === id);
      if (found) found.qty += 1;
      else SMSH.cart.push({ id, name, price, img, qty: 1 });

      refreshCartUI();

      if (triggerEl) {
        animateFlyToCart(triggerEl, img, () => {
          triggerCartLandingFeedback({ name, img });
        });
      } else {
        triggerCartLandingFeedback({ name, img });
      }
    }

    SMSH.addToCart = addToCart;

    toast?.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(toastTimer);
      toast.style.pointerEvents = 'none';
      gsap.to(toast, { opacity: 0, x: 12, scale: 0.9, duration: 0.2, overwrite: 'auto' });
      openCart();
    });

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (SMSH.cartOpen) closeCart();
      else openCart();
    });

    itemsBox?.addEventListener('click', (e) => {
      const incBtn = e.target instanceof Element ? e.target.closest('[data-cart-inc]') : null;
      const decBtn = e.target instanceof Element ? e.target.closest('[data-cart-dec]') : null;
      if (incBtn) {
        const item = SMSH.cart.find((c) => c.id === incBtn.getAttribute('data-cart-inc'));
        if (item) item.qty += 1;
        refreshCartUI();
      } else if (decBtn) {
        const id = decBtn.getAttribute('data-cart-dec');
        const idx = SMSH.cart.findIndex((c) => c.id === id);
        if (idx !== -1) {
          SMSH.cart[idx].qty -= 1;
          if (SMSH.cart[idx].qty <= 0) SMSH.cart.splice(idx, 1);
        }
        refreshCartUI();
      }
    });

    function openCheckoutModal() {
      if (!modal || !modalBackdrop) return;
      closeCart();
      const summary = SMSH.cart.map((c) => `${c.qty}x ${c.name}`).join(', ');
      const total = SMSH.cart.reduce((a, c) => a + c.qty * c.price, 0);
      if (modalSummary) {
        modalSummary.textContent = `Your fresh order (${summary}) — Total $${total.toFixed(2)} is fired on the SMSH flat-top.`;
      }
      modal.classList.remove('hidden');
      modal.classList.add('grid');
      modalBackdrop.style.pointerEvents = 'auto';
      modal.style.pointerEvents = 'auto';
      gsap.to(modalBackdrop, { opacity: 1, duration: 0.28, ease: 'power2.out' });
      gsap.fromTo(modal, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.8)' });
    }

    function closeCheckoutModal(clear = false) {
      if (!modal || !modalBackdrop) return;
      modalBackdrop.style.pointerEvents = 'none';
      modal.style.pointerEvents = 'none';
      gsap.to(modalBackdrop, { opacity: 0, duration: 0.24, ease: 'power2.inOut' });
      gsap.to(modal, {
        opacity: 0,
        scale: 0.92,
        duration: 0.24,
        ease: 'power2.in',
        onComplete: () => {
          if (modal.style.pointerEvents === 'none') {
            modal.classList.add('hidden');
            modal.classList.remove('grid');
          }
        },
      });
      if (clear) {
        SMSH.cart = [];
        refreshCartUI();
      }
    }

    checkoutBtn?.addEventListener('click', openCheckoutModal);
    modalBackdrop?.addEventListener('click', () => closeCheckoutModal(false));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeCheckoutModal(false);
    });
    modalClose?.addEventListener('click', () => closeCheckoutModal(false));
    modalDone?.addEventListener('click', () => closeCheckoutModal(true));

    document.addEventListener('click', (e) => {
      if (SMSH.cartOpen && !widget.contains(e.target)) closeCart();
    });
  }

  function initFlavorDips(container) {
    const dipSection = container.querySelector('#flavor-dips');
    const stamp = container.querySelector('[data-dip-stamp="true"]');
    const dips = gsap.utils.toArray('[data-flavor-dip="true"]', container);
    if (!dipSection || !dips.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cutoutImgs = gsap.utils.toArray('.flavor-dip-img img', dipSection);
    const floatTweens = [];
    let sectionVisible = true;

    if (stamp && !reduceMotion) {
      const restRot = window.innerWidth < 768 ? 0 : -3;
      gsap.set(stamp, { opacity: 0, scale: 0.45, y: 18, rotation: restRot - 10, force3D: true });
      gsap.to(stamp, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: restRot,
        duration: 0.72,
        ease: 'back.out(2.2)',
        force3D: true,
        scrollTrigger: { trigger: dipSection, start: 'top 88%', once: true },
      });
    }

    const innerBlocks = dips.map((card) =>
      gsap.utils.toArray(':scope > div:first-child > *', card)
    );
    innerBlocks.forEach((els) => {
      if (els.length && !reduceMotion) gsap.set(els, { opacity: 0, y: 16, force3D: true });
    });

    gsap.set(dips, {
      opacity: 0,
      y: 52,
      scale: 0.86,
      rotation: (i) => (i - 1) * 4.5,
      force3D: true,
    });
    gsap.to(dips, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      stagger: 0.11,
      ease: 'back.out(1.75)',
      force3D: true,
      scrollTrigger: { trigger: dipSection, start: 'top 88%', once: true },
    });

    if (!reduceMotion) {
      innerBlocks.forEach((els, idx) => {
        if (!els.length) return;
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.055,
          delay: 0.12 + idx * 0.1,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: { trigger: dipSection, start: 'top 86%', once: true },
        });
      });
    }

    if (cutoutImgs.length && !reduceMotion) {
      gsap.set(cutoutImgs, { scale: 0.55, rotation: -18, opacity: 0, force3D: true });
      gsap.to(cutoutImgs, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.16,
        stagger: 0.11,
        ease: 'back.out(2.3)',
        force3D: true,
        scrollTrigger: { trigger: dipSection, start: 'top 86%', once: true },
        onComplete: () => {
          cutoutImgs.forEach((img, idx) => {
            const floatTween = gsap.to(img, {
              y: -7,
              rotation: idx % 2 === 0 ? 5 : -5,
              duration: 1.9 + idx * 0.28,
              delay: idx * 0.2,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              force3D: true,
              paused: !sectionVisible,
            });
            floatTweens[idx] = floatTween;
            addPageCleanup(() => floatTween.kill());
          });
        },
      });
    }

    if ('IntersectionObserver' in window && !reduceMotion) {
      const io = new IntersectionObserver(
        (entries) => {
          sectionVisible = !!entries[0]?.isIntersecting;
          floatTweens.forEach((t, idx) => {
            if (t && !dips[idx]?.matches(':hover')) {
              sectionVisible ? t.play() : t.pause();
            }
          });
        },
        { rootMargin: '150px 0px' }
      );
      io.observe(dipSection);
      addPageCleanup(() => io.disconnect());
    }

    if (!window.matchMedia('(pointer: coarse)').matches && !reduceMotion) {
      dips.forEach((card, idx) => {
        const img = card.querySelector('.flavor-dip-img img');

        card.addEventListener('mouseenter', () => {
          floatTweens[idx]?.pause();
          gsap.to(card, {
            y: -10,
            scale: 1.025,
            rotation: idx === 0 ? -1.4 : idx === 2 ? 1.4 : 0,
            duration: 0.36,
            ease: 'power3.out',
            force3D: true,
            overwrite: 'auto',
          });
          if (img) {
            gsap.fromTo(
              img,
              { rotation: idx % 2 === 0 ? -12 : 12 },
              { rotation: idx % 2 === 0 ? 5 : -5, duration: 0.55, ease: 'elastic.out(1.2, 0.45)', overwrite: 'auto' }
            );
          }
        });

        card.addEventListener(
          'mousemove',
          (e) => {
            const rect = card.getBoundingClientRect();
            if (!rect.width) return;
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            gsap.to(card, {
              x: nx * 4,
              y: -10 + ny * 3,
              rotation: nx * 2.2,
              duration: 0.3,
              ease: 'power2.out',
              force3D: true,
              overwrite: 'auto',
            });
          },
          { passive: true }
        );

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.65,
            ease: 'elastic.out(1, 0.55)',
            force3D: true,
            overwrite: 'auto',
          });
          if (floatTweens[idx] && sectionVisible) {
            floatTweens[idx].invalidate();
            floatTweens[idx].restart(true);
          }
        });
      });
    }
  }

  function initMenuPage(container) {
    const grids = gsap.utils.toArray('#menu-cards-grid, #flavors-cards-grid', container);
    grids.forEach((grid) => {
      const cards = gsap.utils.toArray('[data-menu-card="true"]', grid);
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 32, scale: 0.96, force3D: true });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.06,
          ease: 'back.out(1.4)',
          force3D: true,
          clearProps: 'transform',
          scrollTrigger: { trigger: grid, start: 'top 90%', once: true },
        });
      }
    });

    initFlavorDips(container);

    // Interactive Flavor Category Filter Pills
    const filterBtns = gsap.utils.toArray('[data-flavor-filter]', container);
    if (filterBtns.length) {
      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const cat = btn.getAttribute('data-flavor-filter') || 'all';
          const sectionScope = btn.closest('section') || container;
          const siblingBtns = gsap.utils.toArray('[data-flavor-filter]', sectionScope);
          const allCards = gsap.utils.toArray('[data-menu-card="true"]', sectionScope);
          const countEl = sectionScope.querySelector('[data-flavor-count]');

          siblingBtns.forEach((b) => b.setAttribute('data-active', b === btn ? 'true' : 'false'));

          const visibleCards = [];
          allCards.forEach((card) => {
            const cardCat = card.getAttribute('data-flavor-cat') || 'all';
            const match = cat === 'all' || cardCat === cat;
            card.classList.toggle('hidden', !match);
            if (match) visibleCards.push(card);
          });

          if (countEl) {
            const n = visibleCards.length;
            countEl.textContent = `${n} ${n === 1 ? 'Flavor' : 'Flavors'}`;
          }

          if (visibleCards.length) {
            gsap.fromTo(
              visibleCards,
              { opacity: 0, y: 26, scale: 0.92 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.52,
                stagger: 0.06,
                ease: 'back.out(1.7)',
                overwrite: 'auto',
              }
            );
          }

          ScrollTrigger.refresh();
        });
      });
    }

    container.querySelectorAll('[data-add-cart]').forEach((btn) => {
      const originalHtml = btn.innerHTML;
      let resetTimer = null;

      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-add-cart');
        const name = btn.getAttribute('data-item-name') || 'Burger';
        const price = parseFloat(btn.getAttribute('data-item-price') || '16');
        const img = btn.getAttribute('data-item-img') || '';

        SMSH.addToCart?.({ id, name, price, img }, btn);

        gsap.fromTo(btn, { scale: 0.8 }, { scale: 1, duration: 0.42, ease: 'back.out(2.6)', overwrite: 'auto' });

        clearTimeout(resetTimer);
        if (btn.classList.contains('add-cart-circle')) {
          btn.innerHTML =
            '<svg class="w-full h-full object-contain" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          btn.classList.add('bg-red', 'text-white');
        } else {
          btn.textContent = '✓ Added!';
        }

        resetTimer = setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('bg-red', 'text-white');
        }, 900);
      });
    });
  }

  function initSpicesPage(container) {
    const stage = container.querySelector('#story-bite-stage');
    const path = container.querySelector('#story-bite-path');
    const runners = gsap.utils.toArray('[data-spice-runner="true"]', container);

    const mobileStage = container.querySelector('#story-bite-mobile-stage');
    const mobilePath = container.querySelector('#story-bite-mobile-path');
    const mobileRunners = gsap.utils.toArray('[data-spice-mobile-runner="true"]', container);
    const mobileCards = gsap.utils.toArray('[data-spice-mobile-card="true"]', container);

    const mm = gsap.matchMedia();
    addPageCleanup(() => mm.revert());

    mm.add('(min-width: 768px)', () => {
      if (!stage || !path || !runners.length) return;
      const count = runners.length;
      gsap.set(runners, { xPercent: -50, yPercent: -50, opacity: 0, force3D: true });

      const segTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: '12% center',
          end: '92% center',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let t = 0; t < count; t++) {
        const at = t * 1;
        segTl.fromTo(
          runners[t],
          { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: t / count, end: t / count } },
          { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: t / count, end: (t + 1) / count }, duration: 1, ease: 'none' },
          at
        );
        segTl.fromTo(runners[t], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, at);
        segTl.to(runners[t], { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, at + 0.8);
      }
    });

    mm.add('(max-width: 767px)', () => {
      if (!mobileStage) return;

      mobileCards.forEach((card, idx) => {
        gsap.set(card, { opacity: 0, scale: 0.84, y: 40, force3D: true });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              card,
              { opacity: 0, scale: 0.84, rotate: idx % 2 === 0 ? -4 : 4, y: 40 },
              { opacity: 1, scale: 1, rotate: idx % 2 === 0 ? -1.5 : 1.5, y: 0, duration: 0.55, ease: 'back.out(2.1)', overwrite: 'auto', force3D: true }
            );
          },
        });
      });

      if (mobilePath) {
        gsap.to(mobilePath, {
          strokeDashoffset: -240,
          ease: 'none',
          scrollTrigger: {
            trigger: mobileStage,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      if (mobilePath && mobileRunners.length) {
        const count = mobileRunners.length;
        gsap.set(mobileRunners, { xPercent: -50, yPercent: -50, opacity: 0, force3D: true });

        const segTl = gsap.timeline({
          scrollTrigger: {
            trigger: mobileStage,
            start: 'top 65%',
            end: '94% center',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let t = 0; t < count; t++) {
          const at = t * 1;
          segTl.fromTo(
            mobileRunners[t],
            {
              rotation: t % 2 === 0 ? -15 : 15,
              motionPath: { path: mobilePath, align: mobilePath, alignOrigin: [0.5, 0.5], start: t / count, end: t / count },
            },
            {
              rotation: t % 2 === 0 ? 15 : -15,
              motionPath: { path: mobilePath, align: mobilePath, alignOrigin: [0.5, 0.5], start: t / count, end: (t + 1) / count },
              duration: 1,
              ease: 'none',
            },
            at
          );
          segTl.fromTo(mobileRunners[t], { opacity: 0, scale: 0.78 }, { opacity: 1, scale: 1, duration: 0.16, ease: 'power1.out' }, at + 0.12);
          segTl.to(mobileRunners[t], { opacity: 0, scale: 0.78, duration: 0.16, ease: 'power1.in' }, at + 0.72);
        }
      }
    });
  }

  function initContactPage(container) {
    const form = container.querySelector('#smsh-contact-form');
    const topicInput = container.querySelector('#contact-topic');
    const topicBtns = container.querySelectorAll('.contact-topic-btn');
    const nameInput = container.querySelector('#contact-name');
    const emailInput = container.querySelector('#contact-email');
    const messageInput = container.querySelector('#contact-message');
    const errorEl = container.querySelector('#contact-error');
    const submitBtn = container.querySelector('#contact-submit');
    const successCard = container.querySelector('#contact-success');
    const successSummary = container.querySelector('#contact-success-summary');
    const resetBtn = container.querySelector('#contact-reset');

    if (!form) return;

    topicBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-topic') || 'General';
        if (topicInput) topicInput.value = val;
        topicBtns.forEach((b) => b.setAttribute('data-active', b === btn ? 'true' : 'false'));
      });
    });

    const clearError = () => {
      if (errorEl) errorEl.textContent = '';
    };
    [nameInput, emailInput, messageInput].filter(Boolean).forEach((el) => el.addEventListener('input', clearError));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (nameInput?.value || '').trim();
      const email = (emailInput?.value || '').trim();
      const message = (messageInput?.value || '').trim();
      const topic = (topicInput?.value || 'General').trim();

      let errMsg = '';
      let focusEl = null;

      if (name.length < 2) {
        errMsg = 'Please enter your name.';
        focusEl = nameInput;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errMsg = 'Please enter a valid email address.';
        focusEl = emailInput;
      } else if (message.length < 4) {
        errMsg = 'Tell us your craving first.';
        focusEl = messageInput;
      }

      if (errMsg) {
        if (errorEl) errorEl.textContent = errMsg;
        if (focusEl) focusEl.focus();
        if (submitBtn) {
          submitBtn.classList.remove('animate-shake');
          void submitBtn.offsetWidth;
          submitBtn.classList.add('animate-shake');
        }
        return;
      }

      if (successSummary) {
        successSummary.textContent = `Thanks, ${name}! Our ${topic} kitchen team at SMSH received your note and will reply to ${email} soon.`;
      }

      gsap.to(form, {
        opacity: 0,
        y: -12,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          form.classList.add('hidden');
          if (successCard) {
            successCard.classList.remove('hidden');
            gsap.fromTo(successCard, { opacity: 0, scale: 0.9, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' });
          }
        },
      });
    });

    resetBtn?.addEventListener('click', () => {
      form.reset();
      if (topicInput) topicInput.value = 'General';
      topicBtns.forEach((b) => b.setAttribute('data-active', b.getAttribute('data-topic') === 'General' ? 'true' : 'false'));
      clearError();

      if (successCard) {
        gsap.to(successCard, {
          opacity: 0,
          scale: 0.95,
          duration: 0.22,
          ease: 'power2.in',
          onComplete: () => {
            successCard.classList.add('hidden');
            form.classList.remove('hidden');
            gsap.fromTo(form, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          },
        });
      }
    });
  }

  /* ------------------------------------------------------------------------
     10. CONTAINER LIFECYCLE (INIT / CLEANUP FOR BARBA & RESPONSIVE RESIZE)
     ------------------------------------------------------------------------ */
  function cleanupPage() {
    SMSH.navDarkTriggers.forEach((st) => st.kill());
    SMSH.navDarkTriggers = [];

    SMSH.lineSplitTriggers.forEach((st) => st.kill());
    SMSH.lineSplitTriggers = [];

    if (SMSH.pageCtx) {
      SMSH.pageCtx.revert();
      SMSH.pageCtx = null;
    }

    SMSH.pageCleanups.forEach((fn) => {
      try {
        fn();
      } catch { }
    });
    SMSH.pageCleanups = [];
  }

  function initPageContainer(container = getActiveContainer()) {
    SMSH.currentNamespace = container.getAttribute('data-barba-namespace') || 'home';
    SMSH.refreshCartUI?.();

    SMSH.pageCtx = gsap.context(() => {
      prepareHeroStates(container);
      setupMaskedLineAnimations(container);
      attachNavDarkTriggers(container);
      initOrganicButtons(container);
      initPeelStickers(container);
      initJellyWaves(container);
      initScrollTextAnimations(container);

      if (SMSH.currentNamespace === 'home') {
        initHeroParallax(container);
        initAboutMediaCards(container);
        initExperience(container);
        initIngredients(container);
        initMenuPage(container);
        initMap(container);
      } else if (SMSH.currentNamespace === 'menu') {
        initMenuPage(container);
      } else if (SMSH.currentNamespace === 'spices') {
        initSpicesPage(container);
      } else if (SMSH.currentNamespace === 'contact') {
        initContactPage(container);
      }

      initCtaAndFooter(container);
    }, container);
  }

  function initResponsiveResize() {
    let prevWidth = window.innerWidth;
    let resizeTimer = null;

    window.addEventListener(
      'resize',
      () => {
        if (window.innerWidth === prevWidth) return;
        prevWidth = window.innerWidth;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setupMaskedLineAnimations(getActiveContainer());
          ScrollTrigger.refresh();
        }, 180);
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------------
     11. BOOTSTRAP APPLICATION
     ------------------------------------------------------------------------ */
  window.SMSH = {
    ...SMSH,
    setupMaskedLineAnimations,
    initScrollTextAnimations,
    initPeelStickers,
    initOrganicButtons,
  };

  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initNavigation();
    initIngredientCursor();
    initCartSystem();
    initPageContainer(getActiveContainer());
    initBarbaTransitions();
    initResponsiveResize();
    initPreloader();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!SMSH.heroRevealed && !SMSH.heroAnimating && !SMSH.isTransitioning) {
          setupMaskedLineAnimations(getActiveContainer());
          ScrollTrigger.refresh();
        }
      });
    }
  });
})();
