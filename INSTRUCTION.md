# INSTRUCTION.md — Phased Plan & Live Session Handoff Tracker

## 1. Current Session Handoff Banner
- **Current Phase:** **Session 31 Complete — Centered `#preloader` Burger Stack Across All Viewports (`1440x900`, `375x812`)**
- **Brand Identity:** **SMSH** (Multi-page Vanilla HTML architecture matching `cravburgers.shop` theme, colors, fonts, and GSAP animations)
- **Tech Stack Locked:** Pure Vanilla HTML (`index.html`, `menu.html`, `spices.html`, `contact.html`) + Tailwind CSS CDN + Custom CSS (`css/styles.css`) + **Barba.js (`@barba/core@2.10.3`) CDN** + GSAP CDN (`gsap`, `ScrollTrigger`, `MotionPathPlugin`) + Lenis CDN + Vanilla JS (`js/app.js`)
- **Last Completed Task:** Fixed `#preloader` burger stack alignment across all 4 pages so the loading screen stays dead-center horizontally and vertically on both phone and desktop regardless of Tailwind Play CDN parse timing:
  1. **Eliminated Double `-50%` Shift (`index.html`, `menu.html`, `spices.html`, `contact.html`, `js/app.js`):** Replaced `left-1/2 -translate-x-1/2 w-full` on all 6 `.preloader-layer`s per page with `left-0 w-full` and removed `xPercent: -50` (`xPercent: 0, x: 0`) in [`initPreloader`](file:///c:/Users/Adan/Desktop/www/js/app.js#L402-L545) so cached Tailwind CSS transforms never stack with GSAP `xPercent` to push the burger left.
  2. **Centered Stage Vertically (`index.html`, `menu.html`, `spices.html`, `contact.html`):** Removed `mb-[8vw]` from `#preloader-burger-stage` so flex centering places the burger stack in the exact middle of `#preloader`.
- **Next Immediate Task:** Ready for deployment or any further user requests.
- **Known Issues / Blockers:** None (verified in Playwright at `1440x900` & `375x812` on both initial and cached subpage loads; `0` console errors; `.playwright-mcp` removed).

---

## 2. Master Execution Plan (6 Clean Vanilla HTML/GSAP Phases)

- [x] **Phase 0: Discovery, Asset Extraction & Persistent Memory (`AGENT.md` + `INSTRUCTION.md`)**
  - Completed `/grill-me` alignment (Vanilla HTML + Tailwind CDN + GSAP CDN + Lenis CDN + Vanilla JS, single-page flagship `index.html`, brand name **SMSH**).
  - Downloaded all 22 original transparent cutouts, peelable stickers, and city/kitchen photos into `./assets/img-webp/` and `./assets/img/`.
  - Extracted all 12 exact vector SVGs (preloader burger layers, liquid curves, `.jelly` wave dividers, organic blob button, sticker lighting filters, cartoon eyebrows, flight paths) into `./assets/svg/`.

- [x] **Phase 1: Foundation, Preloader & Navigation (`index.html`, `css/styles.css`, `js/app.js`)**
  - Configured Tailwind CDN strictly with `beige` (`#F5E3CD`), `red` (`#F91814`), `white` (`#FFFFFF`), `black` (`#1B1B1B`), `mustard` (`#FFD750`), and `mustard-dark` (`#F4A804`).
  - Loaded Google Fonts `Modak` and `Mouse Memoirs` + defined `.heading600`, `.heading300`, `.heading180`, `.text96`, `.text60`, `.text40`, `.text-stroke*`, and `.sticker-*` rules in `css/styles.css`.
  - Initialized Lenis smooth scroll synced with `ScrollTrigger.update`, fixed `#navbar` (`SMSH` in `Modak`, `Burgers` pill, `Menu` pill with animated 3-line burger-to-X icon), `#main-menu` top-right scale-in red popover, and blurred `bg-red/30` backdrop.

- [x] **Phase 2: Hero Section (`#hero`), Brand Story (`#about`) & Silky Preloader Polish**
  - Upgraded `#preloader` to cushioned `power3.out`/`back.out` burger assembly + continuous two-speed liquid SVG wave curtains (`power3.inOut` edges + `expo.inOut` center arch).
  - Built `#hero`: Giant `30vw` `THE BURGER` (`Mouse Memoirs`, red + white stroke, `data-pop`), tilted `SMASHED FRESH` & `BOLD FLAVOR` `Modak` stamps, floating `burgerH.webp` with cartoon Pac-Man eyes + continuous float & mouse parallax, `15vw` `SMSH` mustard-dark wordmark, bottom split masked paragraphs (`[data-line-mask="true"]`), and global `#ingredient-cursor-trail`.
  - Built `#about`: `TOP CLASSIC` stamp, `JUICY CHEESY FULLY LOADED` (`heading300` pop-in), masked **SMSH** story copy, organic blob `"Order Now"` button (`btn-blob.svg` elastic hover), peelable `burgerselfie.png` `.sticker-wrapper`, and 3 fanned photo cards (`about-1.webp`, `about-2.webp`, `about-3.webp`) with pointer-velocity spring throw.

- [x] **Phase 3: Experience Section (`#experience`) & Full-Bleed Cheesy Divider**
  - Add top `.jelly` elastic curved SVG divider transitioning `--beige` -> `--red`.
  - Implement interactive peelable die-cut stickers (`fries.webp` & `burger.webp`) with SVG `#pointLight` filter and GSAP hover/click peel flap.
  - Build `EXPERIENCE` stamp + `FOOD THAT FEELS GOOD` (`heading300` beige pop-in) + `burgerwithhands.webp` with live cursor-tracking cartoon googly eyes & `cartoon-eyebrow.svg` eyebrows + masked nutritional copy (`450 kcal / High Protein / Fresh Ingredients` & `100% Organic / Zero Guilt / True Taste`) + `BOLD FLAVOUR` stamp.
  - Build `160vh` (`max-md:70vh`) full-bleed parallax `cheesyBurger.webp` framed by top & bottom `.jelly` curved SVG waves.

- [x] **Phase 4: Deconstructed Ingredients (`#ingredients`)**
  - Build `PURE QUALITY` tilted stamp + 4 stacked `heading300` masked reveal lines (`EVERY LAYER / PACKED WITH / SIGNATURE / FLAVOR`).
  - Animate the 4 floating transparent burger cutouts (`tomato.webp`, `cheese.webp`, `meat.webp`, `lettuce.webp`) with buttery `ScrollTrigger` scrub parallax & rotation across desktop and mobile breakpoints.

- [x] **Phase 5: Global Takeaway Flight Path (`#map-desktop` & `#map-mobile`)**
  - Transition via `.jelly` SVG divider into `bg-mustard` (`#FFD750`), with `TAKE AWAY` stamp + `QUALITY THAT TRAVELS WITH YOU` (`text-white text-stroke-180-mustard`) + masked intro copy.
  - Desktop (`#map-desktop`): Draw `story-winding-path.svg` via `ScrollTrigger` `stroke-dashoffset` while flying `plane.png` along the curve with GSAP `MotionPathPlugin` past the 5 scattered interactive city cards (`BERLIN`, `LONDON`, `NEW YORK`, `SYDNEY`, `TOKYO`).
  - Mobile (`#map-mobile`): Vertical flight path (`vertical-line.svg`) + rotating plane markers + stacked rounded city cards (`berlin.webp`..`tokyo.webp`).

- [x] **Phase 6: CTA Banner (`#cta`), Kinetic Footer (`#footer`) & Final Responsive Polish**
  - Build `#cta`: `.jelly` divider back to `--beige`, giant peelable `burger-boy.png` sticker, `FEEL IT` stamp, `FEEL THE CHANGE` pop-in headline, masked copy, organic blob `"Order Now"` button, and `cta.webp` wooden board burger card.
  - Build `#footer`: Double-layer masked hover nav links (`Home`, `Burgers`, `Spices`, `Contact`), `© 2026 SMSH — All rights reserved`, `Smashed patties · toasted buns · est. 1997`, divider line, and giant `35vw` `Modak` **`SMSH`** (`S-M-S-H` pop-in) with interactive juggling ingredient cutouts (`lettuce.webp`, `tomato.webp`, `cheese-logo.webp`, `meat.webp`).
  - Full QA sweep across `375px`, `768px`, `1280px`, and `1920px+` for zero horizontal overflow, 60fps buttery GSAP timelines, and complete `ScrollTrigger.refresh()` accuracy.

---

## 3. Changelog & File Modifications

### [Session 2 — `/grill-me` Architecture Lock, Asset Download & Memory Initialization]
- **Files Created/Modified:**
  - `AGENT.md`, `AGENTS.md`, `INSTRUCTION.md`
  - `./assets/img-webp/*` (19 WebP cutouts/stickers/photos), `./assets/img/*` (3 PNG die-cuts), `./assets/svg/*` (12 exact vector SVGs)
- **What Changed:** Aligned design & stack decisions via `/grill-me`, extracted exact live tokens (`#F5E3CD`, `#F91814`, `#FFFFFF`, `#1B1B1B`, `#FFD750`, `#F4A804`) and Google Fonts (`Modak` & `Mouse Memoirs`), and downloaded all 34 assets offline.
- **Where We Left Off:** Ready to start Phase 1.

### [Session 3 — Phase 1: Foundation, Preloader & Navigation]
- **Files Created/Modified:**
  - `css/styles.css`, `index.html`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:** Built Phase 1 foundation, 6-token Tailwind config, `Modak` & `Mouse Memoirs` typography + paint-order white strokes, Lenis + `ScrollTrigger` sync, 6-layer SVG burger preloader, and `#navbar` + `#main-menu` scale-in red popover.
- **Where We Left Off:** Ready for Phase 2.

### [Session 4 — Phase 2: Hero Section (`#hero`), Brand Story (`#about`) & Silky Preloader Polish]
- **Files Created/Modified:**
  - `index.html` (Built 1:1 `#hero` matching user screenshot with `30vw` `THE BURGER`, tilted `SMASHED FRESH` & `BOLD FLAVOR` stamps, `40vw` `burgerH.webp` with Pac-Man eyes & aligned eyebrows, `15vw` bottom `SMSH` wordmark, left/right `[data-line-mask="true"]` copy, `#ingredient-cursor-trail` 4-pill cursor, and `#about` with `TOP CLASSIC`, `JUICY CHEESY FULLY LOADED`, organic blob `"Order Now"`, peelable `burgerselfie.png` sticker, and 3 fanned `about-1..3.webp` cards)
  - `css/styles.css` (Added `.line-mask` / `.line-mask-inner`, `[data-anm-btn]` hover fill, coarse-pointer `#ingredient-cursor-trail` hide rule, and fixed `--peel-amount: 0` unpeeled default so `.sticker-main` polygon clip displays stickers cleanly)
  - `js/app.js` (Implemented eased `sine.inOut` + `power3.out`/`back.out(1.6)` cushioned burger preloader and continuous two-speed `power3.inOut` + `expo.inOut` liquid SVG wave curtains, visual word-to-line splitter `setupMaskedLineAnimations` with font-ready & resize re-measurement, `runHeroEntrance` + infinite burger float + mouse parallax, `#ingredient-cursor-trail` physics, `[data-anm-btn]` elastic squish, `.sticker-wrapper` scroll-slap + hover/press peel, and `.media-item` velocity spring throw)
  - `INSTRUCTION.md` (Marked Phase 2 `[x]` and documented Phase 3 handoff)
- **What Changed:** Visually verified `#hero` and `#about` in headless Chromium (`1440x780` & `390x844`) side-by-side against the user's screenshot—0 console errors and zero horizontal overflow.
- **Where We Left Off:** Refined Hero entrance choreography in Session 5.

### [Session 5 — Hero 4-Beat Sequential Buttery Choreography Polish]
- **Files Created/Modified:**
  - `index.html` (Added explicit `data-hero-step="heading"`, `data-hero-step="stamp"`, `data-hero-step="wordmark"`, and `.hero-gpu` compositing classes across `#hero` elements)
  - `css/styles.css` (Added `[data-hero-step]` centered `transform-origin: 50% 55%` and `.hero-gpu` hardware-acceleration layer rules)
  - `js/app.js` (Rebuilt `prepareHeroStates` & `runHeroEntrance` into a `C¹`-continuous 4-beat `power3.out` overshoot → `sine.inOut` settle timeline, and synced preloader wave curtain handoff to `curtainStart + 1.04` so Beat 1 starts right as the final liquid arch clears the heading zone)
  - `INSTRUCTION.md` (Logged 4-beat Hero choreography polish; Phase 3 remains queued next)
- **What Changed:** Implemented exact sequential Hero choreography: (1) `THE BURGER` scales past `1.0` (`1.13x`) then smoothly settles to `1.0`, (2) Center burger (`burgerH.webp`) cushions in & begins floating, (3) `SMASHED FRESH` & `BOLD FLAVOR` bloom in, and (4) Bottom `SMSH` + masked paragraphs glide up with `power4.out` (`1.28s`).
- **Where We Left Off:** Refined Beat 1 (`THE BURGER`) into a tilted elastic & bouncy spring in Session 6.

### [Session 6 — Tilted Elastic & Bouncy `THE BURGER` Heading Polish]
- **Files Created/Modified:**
  - `js/app.js` (Updated `prepareHeroStates` and Beat 1 of `runHeroEntrance` so `[data-hero-step="heading"]` (`THE` & `BURGER`) starts counter-tilted & skewed (`rotation: -14° / +12°`, `skewX: -6° / +5°`, `scale: 0.28`, `yPercent: 34`, `transformOrigin: '50% 65%'`) and springs into place with `elastic.out(1.18, 0.44)` scale/translate + `elastic.out(1.22, 0.42)` rotation/skew recovery, staggered `0.1s`, while keeping `opacity` decoupled on `power2.out`)
  - `INSTRUCTION.md` (Updated Session Handoff Banner and appended Session 6 changelog)
- **What Changed:** Added playful tilted, elastic & bouncy spring physics to `THE BURGER` while preserving the full 4-beat Hero sequence (`THE BURGER` -> `burgerH.webp` -> `SMASHED FRESH` & `BOLD FLAVOR` -> `SMSH` & masked paragraphs); verified in headless Chromium (`0` console errors, `overflowX: false`, exact `matrix(1, 0, 0, 1, 0, 0)` resting transform).
- **Where We Left Off:** Next prompt should read `AGENT.md` and `INSTRUCTION.md`, then build **Phase 3: Experience Section (`#experience`) & Full-Bleed Cheesy Divider** in `index.html`, `css/styles.css`, and `js/app.js`.

### [Session 7 � Hero Choreography Sync & Smoothing]
- **Files Created/Modified:** `js/app.js` (`runHeroEntrance`), `INSTRUCTION.md`
- **What Changed:** Tightened the 4-beat timeline into overlapping beats so each starts while the previous is still settling: heading 0s, burger 0.62s, stamps 1.08s, SMSH wordmark 1.42s, paragraphs 1.5s (`expo.out`, 1.4s, stagger 0.07). Total hero entrance now ~3s instead of ~3.6s with no dead gaps.
- **Where We Left Off:** Build **Phase 3: Experience Section (`#experience`)** next.

### [Session 8 � Hero Animation Re-synced to Original Site Timings]
- **Files Created/Modified:** `js/app.js` (`prepareHeroStates`, `runHeroEntrance`), `INSTRUCTION.md`
- **What Changed:** Replaced the custom elastic/tilt heading with the reference site's actual word-pop: each word starts at scale 0, random y 18-40, random rotation �16�, origin 50% 90%, then pops with `back.out(2.35)` (0.72s, stagger 0.055). Synced timeline: heading 0s, stamps 0.15s, paragraphs 0.25s, burger 0.5s (scale .5/y100/rotate-5 to rest, `back.out(1.5)`, 1.5s), SMSH wordmark 0.8s, burger float starts 1.7s (y -15, 2.5s sine yoyo). Verified: 0 console errors, no horizontal overflow, all words settle at identity transform.
- **Where We Left Off:** Build **Phase 3: Experience Section (`#experience`)** next.

### [Session 9 � Preloader Burger Uniform Sizing & Faster Timing]
- **Files Created/Modified:** `index.html` (preloader layers), `js/app.js` (`initPreloader`), `INSTRUCTION.md`
- **What Changed:** All 6 preloader burger SVG layers now share the same width (`w-full`) and keep their native `aspect-ratio`, so none is stretched or scaled differently. Stage is taller (`h-[100vw]`, max 460/600px) with even 10% spacing so every layer is visible. Preloader sped up: progress 2.55s -> 1.7s, layer stagger 0.31 -> 0.2s, curtain start 2.62s -> 1.75s, hero handoff curtainStart+0.9.
- **Where We Left Off:** Build **Phase 3: Experience Section (`#experience`)** next.


### [Session 10 — Phases 3-6: Experience, Ingredients, Global Takeaway, CTA & Footer]
- **Files Created/Modified:** `index.html` (replaced placeholders with #experience, #ingredients, #map-section, #cta, #footer), `js/app.js` (added initExperience, initIngredients, initMap, initCtaAndFooter + bootstrap calls), `INSTRUCTION.md`
- **What Changed:** #experience (jelly top wave, peelable fries/burger stickers, EXPERIENCE stamp, FOOD THAT FEELS GOOD, burgerwithhands with cursor-tracking googly eyes + eyebrows, nutrition masked copy, BOLD FLAVOUR stamp, 160vh parallax cheesyBurger framed by jelly waves); #ingredients (PURE QUALITY, 4 masked lines, 4 scroll-drifting cutouts); #map-section (mustard bg, TAKE AWAY, QUALITY THAT TRAVELS WITH YOU, winding dashed path + plane via MotionPathPlugin, 5 city cards, mobile vertical path); #cta (burger-boy peelable sticker, FEEL IT / FEEL THE CHANGE, blob Order Now, cta photo); #footer (red, split-hover links, copyright, giant 35vw SMSH with juggling ingredient cutouts). Verified at 1440x800 and 390x844: 0 console errors, no horizontal overflow.
- **Where We Left Off:** Final QA/polish across 375/768/1280/1920px; compare against reference for spacing tweaks.

### [Session 11 — 1:1 Preloader Scaling Fix & Full-Site Reference Polish]
- **Files Created/Modified:** `index.html`, `css/styles.css`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - Compacted `#preloader-burger-stage` to `max-w-[205px] max-h-[215px] md:max-w-[265px] md:max-h-[280px]` with uniform `w-full` layers stacked cleanly (`bottom: 0%, 5%, 10%, 16%, 22%, 28%`) and snappier `initPreloader()` timing + continuous two-speed liquid wave curtains.
  - Upgraded `initNavigation()` with scroll-direction auto-hide, `[data-nav-dark="true"]` adaptive white contrast over `#experience`, `"Close"` label state, and responsive `#map` resolution (`#map-desktop` vs `#map-mobile`).
  - Added `initJellyWaves()` continuous infinite `yoyo` wave morph + `ScrollTrigger` `scaleY` scrub across all `.jelly` SVG dividers.
  - Replaced Sections 3–6 (`#experience`, `#cheesy-frame`, `#ingredients`, `#map-desktop`, `#map-mobile`, `#cta`, `#footer`) with exact reference modules: oval rotor googly eyes, inner-clipped `cheesyBurger.webp` parallax, Lenis scroll-driven ingredient parallax, forward-oriented `plane.png` (`autoRotate: -90` desktop, segmented mobile flight path) with threshold city card pop-ins + velocity springs, 2-column `#cta` with giant peelable `burger-boy.png`, and `--beige` `#footer` with `scaleX` dividers and parabolic ingredient juggling (`--juggle-scale`).
  - Fixed `window.SMSH.lenis` exposure and triggered `#about-media-stage` reveal early at `top 95%`.
- **Where We Left Off:** Site complete and browser-verified at `1440x800` and `390x844` (`0` console errors, `overflowX: false`, preview server live at `http://127.0.0.1:5500`). Ready for user feedback or additional sub-pages.

### [Session 12 — Multi-Page Architecture, Contact Form, Menu, Spices & Barba.js Liquid Wave Transitions]
- **Files Created/Modified:** `index.html`, `menu.html`, `spices.html`, `contact.html`, `css/styles.css`, `js/app.js`, `serve.mjs` (extensionless `.html` fallback), `assets/img-webp/*`, `assets/burgers/*`, `INSTRUCTION.md`
- **What Changed:**
  - **Multi-Page Expansion & Local Assets:** Downloaded subpage images (`smoky-burger.webp`, `smile.png`, `spices.webp`, `farmtobite.webp`, `lettuceimg.webp`, `tomatoimg.webp`, `cheeseimg.webp`, `tikki.webp`, `bun.webp`, and `burgers/1b.png`–`6b.png`) locally into `./assets/`. Built `menu.html` (6 burger cards with checkerboard hover band & `Quick details` slide-up + persistent floating bag & checkout modal), `spices.html` (`#farmToBite` + `#storyofEveryBite` winding `#journeyPath` ingredient runner ScrollTriggers + mobile card stack), and `contact.html` (`#contact-form` hero with peelable stickers, topic selector pills, validation feedback, and `#contact-success` card).
  - **Barba.js Liquid Curtain Page Transitions (`@barba/core@2.10.3`):** Wrapped `<main>` + `#footer` across all 4 pages in `data-barba="wrapper"` / `data-barba="container"` (`home`, `menu`, `spices`, `contact`). Implemented `playLiquidCoverIn()` and `playLiquidRevealOut()` driving `#page-transition` (`#pt-wave-1` `#4C0016`, `#pt-wave-2` `#EF6F2E`, `#pt-wave-3` `#F91814`) identically to the preloader liquid curtain exit without the burger, dots, or progress UI. Added per-container lifecycle cleanup/re-init (`cleanupPage`, `initPageContainer`), Tailwind CDN frame wait in `beforeEnter`, same-page Lenis scroll prevention, cross-page hash navigation (`resolveHashTarget`, e.g., `./index.html#about`), `#nav-burgers-pill` light outline (`border-white/40`) over dark-nav red sections, and tightened `#contact-form` spacing + `--peel-amount: 0.025` stickers so `SEND CRAVING` fits above both desktop (`1440x800`) and mobile (`390x844`) folds.
  - **Playwright Verification:** Verified `0` console errors across `index.html`, `menu.html`, `spices.html`, and `contact.html` at `1440x800` and `390x844` (`overflowX: false`), captured 60fps mid-transition Barba liquid cover/reveal frames (confirming 3 liquid layers with zero burger), verified Contact form validation + confirmation, Cart persistence across page transitions, and cross-page `./index.html#about` scroll (`aboutTop: 0`).
- **Where We Left Off:** All 4 pages and Barba.js liquid layer transitions verified and live on `http://127.0.0.1:5500`. Ready for any next enhancements or deployment.

### [Session 13 — Same-Page 3-Layer Liquid Wave Transitions & Interactive Menu/Flavors Showcase (`#flavors`)]
- **Files Created/Modified:** `index.html`, `menu.html`, `spices.html`, `contact.html`, `css/styles.css`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Same-Page Liquid Wave Curtain Transitions (`runSamePageLiquidTransition`, `prepareSectionEntrance`, `playSectionEntrance`):** Updated `initNavigation()` and `initBarbaTransitions()` in `js/app.js` so clicking any same-page link (`About` `./index.html#about`, `Flavors` `./index.html#flavors`, `Locations` `./index.html#map`, `Home` `./index.html`, etc.) plays the full 3-layer liquid wave cover-in (`playLiquidCoverIn`) and reveal-out (`playLiquidRevealOut`) transition without the burger stack, repositions behind the curtain, preserves `#navbar` visibility, and animates the target section's `[data-pop="true"]` words and masked lines as the curtain lifts.
  - **Signature Menu & Flavors Section (`#flavors` & `#flavor-dips`):** Added `#flavors` ("OUR FLAVORS / TASTE THE LINEUP") to `index.html` right after `#ingredients`, complete with a peelable `burger.webp` sticker, interactive `[data-flavor-filter]` category filter pills (`All Flavors`, `Classic & Cheesy`, `Fiery & Spicy`, `Smokehouse BBQ`, `Crispy & Fresh`), live `[data-flavor-count]` indicator, 6 burger & flavor cards (`#flavors-cards-grid`) with flavor tags, spice heat badges, checkerboard hover stripes, `Flavor profile` hover cards, and `[data-add-cart]` buttons, plus `#flavor-dips` ("SAUCE & SIDES / CRAFTED FLAVOR BOOSTERS": `Chili Honey Dip` `$4`, `Truffle Cheddar` `$5`, `Smash Fries` `$7`). Added `Flavors` (`./index.html#flavors`) to `#main-menu` across all 4 pages and interactive flavor filter pills to `menu.html`.
  - **Playwright Verification:** Verified `0` console errors at `1440x800` desktop and `390x844` mobile (`overflowX: false`), confirmed mid-transition 3-layer liquid wave curtain on same-page `About` (`aboutTop: 0`) and `Flavors` (`flavorsTop: 0`, `navTop: 0`) clicks, verified flavor category filtering (`1 Flavor` for `Fiery & Spicy`, `3 Flavors` for `Classic & Cheesy`, `6 Flavors` for `All Flavors`), and verified adding `Chili Honey Dip` (`$4.00`) to the persistent cart.
- **Where We Left Off:** All same-page/cross-page liquid wave transitions and the `#flavors` menu showcase are live and verified at `http://127.0.0.1:5500`.

### [Session 14 — Provided `Menu` Page in `#main-menu` Dropdown & Upgraded `menu.html` with Full Flavors Showcase]
- **Files Created/Modified:** `index.html`, `menu.html`, `spices.html`, `contact.html`, `INSTRUCTION.md`
- **What Changed:**
  - **Provided `Menu` (`./menu.html`) in `#main-menu` Dropdown Across All 4 Pages:** Added `Menu` (`href="./menu.html"`) to `#main-menu` in `index.html`, `menu.html`, `spices.html`, and `contact.html` alongside `Home`, `About`, `Flavors`, `Our Spices`, `Locations`, and `Contact` (`text-[2.15vw] gap-[.42vw]`).
  - **Upgraded `menu.html` (`#menu-showcase`):** Updated `menu.html` with the peelable `burger.webp` mascot sticker, all 6 flavor-badged burger cards (`Signature Umami · Mild`, `Chili Honey Heat · Hot`, `Black Truffle · Savory`, `Hickory Smoke · Smoky`, `Triple Cheddar · Cheesy`, `Garden Herb Zest · Fresh`), flavor ingredient subtitles, `Flavor profile` hover cards, and the complete `#flavor-dips` (`SAUCE & SIDES / CRAFTED FLAVOR BOOSTERS`: `Chili Honey Dip` `$4`, `Truffle Cheddar` `$5`, `Smash Fries` `$7`) section.
  - **Playwright Verification:** Verified opening `#main-menu` on `index.html`, clicking `Menu` (`./menu.html`), transitioning via the 3-layer liquid wave curtain to `menu.html`, and rendering all 6 flavor-badged burger cards + 3 `#flavor-dips` cards at `1440x800` desktop and `390x844` mobile (`overflowX: false`, `0` console errors).
- **Where We Left Off:** `Menu` page is linked in both the top navbar (`Burgers` pill) and `#main-menu` dropdown across all 4 pages and verified live at `http://127.0.0.1:5500`.

### [Session 15 — Fixed All 4 Interactive SVG Effects (Sticker Filter Clipping & Peel, Organic Blob Button Morph, Cursor Rope Collapse, & `.jelly` Wave Overlap)]
- **Files Created/Modified:** `js/app.js`, `index.html`, `menu.html`, `spices.html`, `contact.html`, `css/styles.css`, `assets/svg/sticker-filters.svg`, `INSTRUCTION.md`
- **What Changed:**
  - **Expanded Sticker SVG `<filter>` Regions & Restored Reference Peel Physics (`Module 80308`):** Added `x="-50%" y="-50%" width="200%" height="200%"` to `#pointLight`, `#pointLightFlipped`, `#dropShadow`, and `#expandAndFill` in `index.html`, `menu.html`, `spices.html`, `contact.html`, and `assets/svg/sticker-filters.svg` so rotated die-cut stickers (`--sticker-rotate: 30deg`) are never clipped by the default `[-10%, 110%]` SVG filter box. Updated `initPeelStickers()` in `js/app.js` with `ScrollTrigger` scrub (`--peel-amount: 1 -> 0`), hover (`0.3`), active (`0.4`), leave (`0`), and live `<fePointLight>` cursor tracking.
  - **Organic Blob SVG Button Path Morphing (`[data-anm-btn="btn"]` — `Module 23057`):** Replaced the CSS scale squish in `initOrganicButtons()` (`js/app.js`) with 32-number 5-cubic-segment `<path data-anm-btn="path">` `d`-attribute morphing between the base blob (`BLOB_BASE_NUMS`) and 3 organic hover shapes (`BLOB_HOVER_SHAPES`) using `back.out(1.7)` (`0.5s`) on hover and `back.in(1.4)` (`0.5s`) on leave.
  - **Global Ingredient Cursor Trail SVG (`#ingredient-cursor-trail` — `Module 78519`):** Updated `#cursor-trail-path` across all 4 pages to `stroke="#FFFFFF" stroke-width="2" opacity="1"` with uniform `2.2vw` `.cursor-trail-node` pills, and upgraded `initIngredientCursor()` (`js/app.js`) to the 8-segment rope (`segmentCount = 8, segmentLength = 8, knots = [0, 3, 5, 7]`) with tangent knot rotation and automatic `segmentLength: 8 -> 0` collapse (`duration: 0.5, ease: 'expo.out'`) when the pointer stops.
  - **`.jelly` Curved Wave Divider Layering & Barba Cleanup (`Module 36507`):** Adjusted `#about` (`pt-[6vw] pb-[2vw]`) and `#about-media-stage` (`pb-[3vw]`) over `#experience` (`-mt-[15vw]`) so the red `.jelly` wave divider rises visibly behind the lower edge of the 3 fanned photo cards, and registered `waveTl.kill()` + `mm.revert()` in `initJellyWaves()` (`js/app.js`).
- **Where We Left Off:** All 4 SVG effects verified in Playwright (`0` console errors) and live on `http://127.0.0.1:5500`.

### [Session 16 — Single-Pass (1x) Buttery 3-Layer Liquid Page Transition & Zero Duplicate Section/Hero Animations]
- **Files Created/Modified:** `js/app.js`, `index.html`, `menu.html`, `spices.html`, `contact.html`, `INSTRUCTION.md`
- **What Changed:**
  - **Single-Pass 3-Layer Liquid Wave Curtain (`prepareLiquidCurtainFull` + `playLiquidRevealOut`):** Removed the first bottom-to-top cover sweep (`playLiquidCoverIn`) that was causing the 3-layer liquid wave animation to play twice back-to-back on every transition. Now `prepareLiquidCurtainFull()` sets `#pt-wave-3` (`#F91814`), `#pt-wave-2` (`#EF6F2E`), and `#pt-wave-1` (`#4C0016`) to full cover immediately and `playLiquidRevealOut()` plays the 3-layer liquid arch lift **ONLY ONCE** (`0.86s` `power3.inOut` edges + `1.12s` `expo.inOut` center arch, `0.11s` stagger) — identical to the loading screen's exit without the burger.
  - **Prevented Duplicate Section/Hero Text Animations (`prepareSectionEntrance` + `prepareHeroStates`):** Added `gsap.killTweensOf(...)` and killed in-section text `ScrollTrigger`s inside `prepareSectionEntrance()` and `prepareHeroStates()` so `ScrollTrigger.refresh()` never fires a first animation before `playSectionEntrance()` fires a second one.
- **Where We Left Off:** Single-pass buttery liquid wave transition verified in Playwright (`0` console errors) across both same-page (`#about`) and cross-page (`menu.html`) navigation.

### [Session 17 — Makhan-Butter Dynamic Page Name Transition, Enhanced SMSH Poster Menu Cards, Synced SVG Animations & Full Multi-Device Responsiveness]
- **Files Created/Modified:** `index.html`, `menu.html`, `spices.html`, `contact.html`, `css/styles.css`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Makhan-Butter Page Transition with Dynamic Destination Page Name (`#page-transition` — `Module 82148`):** Updated `#page-transition` across all 4 pages with `#pt-wave-3` (`#F4A804` top mustard-dark curtain), `#pt-wave-2` (`#EF6F2E` curved orange band), `#pt-wave-1` (`#F91814` bottom red rim), and `#pt-label-wrap` / `#pt-label-text` (`font-mouse-memoirs text-[#4C0016] heading180 uppercase`). Added `resolveTransitionPageLabel` in `js/app.js` to display `HOME...`, `ABOUT...`, `MENU...`, `BURGERS...`, `FLAVORS...`, `OUR SPICES...`, `LOCATIONS...`, or `CONTACT...` and lift the 3 waves in a single silky pass.
  - **Enhanced SMSH-Themed Poster Menu Cards (`#flavors-cards-grid` & `#menu-cards-grid`):** Redesigned all 6 burger cards with a framed `--beige` stage, tilted `Modak` stamp (`#01 · UMAMI`..`#06 · HERB ZEST`), stroked `Modak` price (`$16`..`$21`), checkerboard ribbon, rotating SVG sunburst halo (`.menu-sunburst`), 3D magnetic floating burger (`[data-card-burger="true"]`), hover-morphing curved SVG wave divider (`[data-card-wave-path="true"]`), and an always-visible white content deck with glaze badge, 3-column flavor profile specs, nutrition summary, and `.split-link` `"Add to Bag"` button.
  - **1:1 Synchronized SVG Animations (`js/app.js`):** Synced `#map-flight-path-active` red stroke-dashoffset drawing with `#map-plane` along `#map-flight-path`, synced `[data-eyebrow]` SVG eyebrows with cursor-tracking googly eyes in `#experience`, synced `.jelly` wave control points with Lenis scroll velocity, added magnetic cursor pull to `[data-anm-btn="btn"]` organic blob buttons, and refined `.sticker-wrapper` scroll peel (`0.14 -> 0`).
  - **Full Multi-Device Responsiveness (`1920`, `1600`, `1400`, `1366`, `1200`, `1024`, `768`, `430`, `390`, `375px`):** Split Tablet (`768px–1024px`) and Mobile (`<=767px`) typography scales in `css/styles.css`, added `max-lg:` responsive grid/spacing rules across all 4 pages, and wrapped `initMap` and `initSpicesPage` in `gsap.matchMedia()`.
- **Where We Left Off:** Verified across all 10 desktop, tablet, and phone viewports in Playwright (`overflowX: false`, `0` console errors).

### [Session 18 — Cover -> Page Name -> Reveal Transition, Original Plane/SVG Effects, Clean Simple SMSH Cards & Parabolic Fly-to-Cart UX]
- **Files Created/Modified:** `index.html`, `menu.html`, `spices.html`, `contact.html`, `css/styles.css`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Two-Phase Liquid Transition with Page Name (`playLiquidCoverIn` + `playLiquidRevealOut`):** Restored exact `Module 82148` sequence: bottom-to-top cover waves (`#F91814 -> #EF6F2E -> #F4A804`), `Modak` destination name reveal (`HOME...`, `ABOUT...`, `MENU...`, `BURGERS...`, `FLAVORS...`, `OUR SPICES...`, `LOCATIONS...`, `CONTACT...`), and smooth second wave lift (`#F4A804 -> #EF6F2E -> #F91814`) uncovering the new page.
  - **Restored Original SVGs & Die-Cut Stickers:** Removed the solid red flight line (`#map-flight-path-active`) from `#map-desktop` so the plane flies along the dashed path as before; restored clean `initJellyWaves`, `initOrganicButtons`, and `initExperience` behaviors; updated `initPeelStickers` and added `.simple-effects` fallback in `css/styles.css` so stickers match the crisp reference look at rest and peel smoothly on hover (`30%`), press (`40%`), and scroll entry.
  - **Simple & Attractive SMSH Menu Cards (`#flavors-cards-grid` & `#menu-cards-grid`):** Simplified all 6 burger cards cleanly with one spice/flavor badge, mustard `+` button, checkerboard ribbon, centered high-res burger cutout, hover `Quick details` card on desktop, red `Mouse Memoirs` title, short ingredient tagline, and `$16`–`$21` price.
  - **Delightful Add-to-Cart UX:** Added `animateFlyToCart()` parabolic burger fly animation into `#smsh-cart-toggle`, cart bag bounce + `.cart-pulse-ring` ripple + floating `+1` pill, `+` -> checkmark button flash, clickable `#smsh-cart-toast` with item thumbnail + `"View Bag"` button, and mini thumbnails inside `#smsh-cart-items`.
- **Where We Left Off:** Browser-verified in Playwright (`0` console errors, `overflowX: false` across `1920`–`375px`).

### [Session 19 — Exact 1:1 `cravburgers.shop` Page Transition (`Module 82148`), Zero Map Red Line, Clean About-to-Experience Curve Separation & Flagship Menu Cards]
- **Files Created/Modified:** `index.html`, `menu.html`, `spices.html`, `contact.html`, `js/app.js`, `serve.mjs`, `INSTRUCTION.md`
- **What Changed:**
  - **No-Cache Preview & Exact `#map-flight-path`:** Added `Cache-Control: no-store` headers in `serve.mjs` and verified `#map-desktop` uses strictly the dashed mustard path (`stroke="#F4A804" stroke-opacity="0.5"`) with zero red line anywhere.
  - **Separated `#about` Photo Cards & Softened `#experience` `.jelly` Wave:** Restored `#about` `py-[6vw]` + `#about-media-stage` `pb-[9vw] max-md:pb-[15vw]`, set `#experience` `-mt-[9vw] max-md:-mt-[6vw]`, and added `data-jelly-soft="true"` (`h-[210px] max-md:h-[95px]`, gentler `scaleY: 1.18`) so the red area never touches the 3 fanned photo cards.
  - **Restored Flagship Clean Menu Cards:** Upgraded `#flavors-cards-grid` & `#menu-cards-grid` back to the tall `h-[35vw]` white cards with full `6vw` checkerboard strip, `size-[21vw]` centered burger cutouts, bold `.text60` titles/prices, frosted hover `Quick details`, and full fly-to-cart UX.
  - **Exact `Module 82148` Transition (`Craving...`):** Matched `https://www.cravburgers.shop`'s transition 1:1 (`0.65s` `power2.out` / `0.85s` `power3.inOut` cover with `Craving...` `#4C0016` `Modak` at `'-=0.4'`, seamlessly lifting via `0.75s` `power2.inOut` / `1.05s` `power4.inOut` while scaling `Craving...` to `1.3`).
- **Where We Left Off:** Verified across desktop, tablet (`768px`), and mobile (`390px`) in Playwright with `0` console errors and `overflowX: false`.

### [Session 20 — Tighter `#about`-to-`#experience` Section Spacing & Deeper `.jelly` Curve]
- **Files Created/Modified:** `index.html`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - Tightened vertical spacing above and inside `#experience`: set `#about` to `pt-[6vw] pb-[3vw]`, `#about-media-stage` to `pb-[2vw] max-md:pb-[4vw]`, `#experience` to `-mt-[6.5vw] max-md:-mt-[6vw]`, and compacted inner spacing (`mt-[3.5vw] translate-y-[2vw]`, `EXPERIENCE` at `top-[1.5vw]`, `h2` at `mt-[5.5vw]`) while maintaining clean separation below all 3 photo cards.
  - Replaced `data-jelly-soft` with a deeper, more expressive `data-jelly-deep="true"` wave (`h-[270px] max-md:h-[115px]`, higher crests and deeper valleys animated continuously + `scaleY: 1.38` on scroll in [`initJellyWaves`](file:///c:/Users/Adan/Desktop/www/js/app.js#L1542-L1614)).
- **Where We Left Off:** Browser-verified in Playwright (`1440x800` & `390x844`, `0` console errors, `overflowX: false`).

### [Session 21 — Duplicate Attribute Cleanup, Responsive `vw` `#experience` Spacing & Balanced Deep `.jelly` Wave]
- **Files Created/Modified:** `index.html`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Duplicate Attributes Removed (`index.html`):** Stripped duplicate `class`, `d`, and leftover `data-jelly-soft="true"` attributes on `#about`, `#about-media-stage`, `#experience`, `.jelly` SVG/path, the inner container, `EXPERIENCE`, and `<h2>` so browsers apply the intended spacing and deep curve classes.
  - **Tight Responsive `vw` Spacing (`index.html`):** Replaced `.self`'s top `8vw` padding on `#experience` with explicit `pt-0 pb-[5vw] px-[2.5vw]` (`max-md:pb-[10vw] max-md:px-[4vw]`), pulled `#experience` up (`-mt-[4vw]`), set `.jelly` height to `h-[14.5vw] max-md:h-[21vw]`, updated the inner headline wrapper to `mt-[13.8vw] max-md:mt-[19.5vw] pt-[1vw] overflow-x-clip` and added `mb-[1.4vw] max-md:mb-[2.8vw]` on `EXPERIENCE` (leaving clean red gap both below the curve and above `FOOD THAT FEELS GOOD` without vertical clipping), and tightened `#about` (`pt-[5vw] pb-[1.5vw]`) + `#about-media-stage` (`pb-[3vw] max-md:pb-[6vw]`) while keeping clean beige clearance below the 3 photo cards.
  - **Smooth Deep `.jelly` Curve (`js/app.js`):** Updated `initJellyWaves` (`data-jelly-deep="true"`) to `{ v: 108, s1c: 18, s1e: 138, s2c: 225, s2e: 138, s3c: 32, s3e: 102 }` animating cleanly without clipping `[0..300]` and `scaleY: 1.18` (desktop) / `1.12` (mobile).
- **Where We Left Off:** Verified across `1920x1080`, `1440x800`, `768x1024`, and `390x844` in Playwright (`overflowX: false`, `0` console errors).

### [Session 22 — Eliminated Menu Cards Scroll Lag / Hang (`#flavors` & `menu.html` 60fps Optimization)]
- **Files Created/Modified:** `assets/burgers/1b.webp`–`6b.webp`, `index.html`, `menu.html`, `spices.html`, `contact.html`, `css/styles.css`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **98.4% Lighter Card Burger Assets (`assets/burgers/1b.webp`–`6b.webp`):** Downsampled the 6 oversized `~3200px` (`6.6–7.9 MB` each, `43.3 MB` total) PNGs to crisp `900px` RGBA WebPs (`81.3–140.8 KB` each, `~690 KB` total) and updated references across `index.html`, `menu.html`, `spices.html`, and `contact.html` with `decoding="async"`.
  - **GPU-Only `.menu-card` Hover & Popovers (`css/styles.css`, `index.html`, `menu.html`):** Replaced `backdrop-blur-md` on card Quick Details tooltips with `bg-white/95`, replaced `transition-all` / `box-shadow` transitions on `.menu-card` with `contain: layout paint; backface-visibility: hidden;` and `translate3d`, removing 6 backdrop-blur passes and repaint stalls.
  - **Main-Thread Frame Optimizations (`js/app.js`):** Gated `initIngredientCursor`'s `gsap.ticker` rope solver with `pointer.awake` so stationary cursors consume `0` CPU ticks during scroll, paused offscreen `.jelly` wave timelines via `IntersectionObserver` in `initJellyWaves`, and set `force3D: true`, `clearProps: 'transform'`, and `once: true` on `initMenuPage`'s grid reveal `ScrollTrigger`.
- **Where We Left Off:** Profiled in Playwright: `#flavors` scroll went from `266.7ms` max frame / `34.2ms` avg down to `16.9ms` max / `16.6ms` avg (`0` frames > 25ms), and `menu.html` measured `16.8ms` max / `16.2ms` avg (`0` console errors, `overflowX: false`).

### [Session 23 — Unified Whole-Card Hover States Across `.menu-card` & `.flavor-dip-card`]
- **Files Created/Modified:** `css/styles.css`, `index.html`, `menu.html`, `INSTRUCTION.md`
- **What Changed:**
  - **Cohesive `.menu-card` Hover Anywhere (`css/styles.css`):** Added `cursor: pointer`, `border: 0.18vw solid transparent` transitioning to `var(--mustard)` on hover, card lift (`translate3d(0, -0.45vw, 0)`), lifted/tilted burger image (`translate3d(0, -1.6vw, 0) scale(1.06) rotate(-2deg)`), checkerboard wave scale + mustard shift, and `+` button activation (`var(--red)` + `scale(1.08)`) across the entire card surface.
  - **Clean Non-Overlapping Quick Details (`index.html`, `menu.html`):** Repositioned Quick Details to `bottom-[7vw] max-lg:bottom-[9.8vw] max-md:hidden` with opaque `bg-white` (`border-black/15`) so card titles & prices stay completely legible beneath it on both desktop and tablet hover.
  - **Whole-Card Hover on `.flavor-dip-card` (`css/styles.css`):** Added `cursor: pointer`, `translate3d` lift, border ring (`var(--mustard)` / `var(--red)`), cutout image bounce, and button scale response whenever hovering anywhere on a dip/side card.
- **Where We Left Off:** Verified in Playwright across `1440x900` and `900x1024` (`gapQdToFooter: 8`, `overflowX: false`, `0` console errors).

### [Session 24 — `Sauce & Sides` Spacing Lift & `#flavor-dips` GSAP Choreographed Animations]
- **Files Created/Modified:** `index.html`, `menu.html`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Raised `SAUCE & SIDES` & `#flavor-dips` Spacing (`index.html`, `menu.html`):** Tightened `#flavor-dips` top spacing (`mt-[3.8vw] max-md:mt-[8vw]` on `index.html`, `mt-[3.5vw] max-md:mt-[7.5vw]` on `menu.html`), separated `SAUCE & SIDES` above `CRAFTED FLAVOR BOOSTERS` with `mb-[1.4vw] max-md:mb-[3vw]`, and enabled masked line reveal (`data-line-mask="true"`) on `"House-made daily in small batches"`.
  - **Kinetic Card & Cutout Motion (`initFlavorDips` in `js/app.js`):** Added elastic stamp pop (`[data-dip-stamp="true"]`), staggered tilted spring entrance for `[data-flavor-dip="true"]`, spinning bounce cutout entrance + `IntersectionObserver`-paused idle float on `.flavor-dip-img img`, and elastic hover wobble returning seamlessly to float on `mouseleave`.
- **Where We Left Off:** Verified in Playwright across `1440x900` and `390x844` (`floatActive: true`, `overflowX: false`, `0` console errors).

### [Session 25 — `.flavor-dip-card` Box Animations, Inner Stagger, Ambient Sheen & 3D Hover Tilt]
- **Files Created/Modified:** `css/styles.css`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Box Entrance & Inner Text Stagger (`initFlavorDips` in `js/app.js`):** Added tilted spring box entrance (`y: 52, scale: 0.86, rotation: (i - 1) * 4.5`) plus sequential inner cascade for badge, title, copy, price, and button (`:scope > div:first-child > *`).
  - **Interactive 3D Pointer Tilt & Elastic Spring (`js/app.js`):** Added hover lift (`y: -10, scale: 1.025`), cursor-tracking micro-tilt on `mousemove`, and elastic return on `mouseleave` without fighting cutout float or CSS border highlights.
  - **Idle Sheen & Hover Gloss Sweep (`css/styles.css`):** Added staggered `@keyframes smshDipSheen` subtle sheen (`::before`) across idle cards and diagonal hover gloss sweep (`::after`) at zero paint cost.
- **Where We Left Off:** Verified in Playwright at `1440x900` (`cardsVisible: true`, `allInnerVisible: true`, `cutoutFloatActive: true`, `cardHovered: true`, `overflowX: false`, `0` console errors).

### [Session 26 — Delayed & Extended `#map-plane` Flight Scroll Window (`initMap`)]
- **Files Created/Modified:** `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Separated `planeScrollCfg` (`initMap` in `js/app.js`):** Adjusted `#map-plane` scroll range from `start: '-10% top'`, `end: '75%'` to `start: 'top top'`, `end: 'bottom 25%'` (`scrollCfg` for cards set to `start: '-6% top'`, `end: '82%'`) so the plane starts `235px` later and completes `362px` lower down `#map-desktop-stage`, staying clearly in frame alongside `SYDNEY` and `TOKYO`.
- **Where We Left Off:** Verified in Playwright across 6 scroll positions (`0` to `1.0`) at `1440x900` (`overflowX: false`, `0` console errors).

### [Session 27 — Instant `#main-menu` Popover Link Animation]
- **Files Created/Modified:** `index.html`, `menu.html`, `spices.html`, `contact.html`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Removed CSS `transition-all` Drag (`index.html`, `menu.html`, `spices.html`, `contact.html`):** Replaced `transition-all duration-300 transform` on `.menu-item-link` across all 4 pages with `transition-colors duration-200` so CSS transitions never fight GSAP's `opacity` or `y` animations.
  - **Eliminated `0.14s` Delay (`openMenu` in `js/app.js`):** Removed `delay: 0.14`, tightened popover open duration (`0.3s`), link stagger (`0.02s`, `duration: 0.22s`, `clearProps: 'transform'`), and bar animations (`0.24s`).
- **Where We Left Off:** Verified in Playwright (`lastLinkOp: 0.99` at `268ms` and `1.0` settled at `384ms`, `0` console errors).

### [Session 28 — Full-Site QA Audit & Final PNG-to-WebP Optimization]
- **Files Created/Modified:** `assets/img-webp/burgerselfie.webp`, `assets/img-webp/burger-boy.webp`, `assets/img-webp/plane.webp`, `index.html`, `menu.html`, `spices.html`, `contact.html`, `INSTRUCTION.md`
- **What Changed:**
  - **Eliminated Mobile/CTA First-Decode Hitches:** Converted `burgerselfie.png` (`2614 KB` -> `129.5 KB`), `burger-boy.png` (`1705 KB` -> `271.0 KB`), and `plane.png` (`804 KB` -> `135.3 KB`) into `./assets/img-webp/*.webp`, updated all 4 HTML pages, and set page-appropriate `<link rel="preload">` targets.
  - **Verified All Pages & Animations:** Confirmed zero duplicate attributes or missing assets across all 4 pages; verified preloader, hero entrances, `#experience` eyes, `#ingredients` parallax, `#flavors` filters/cart/checkout, `#flavor-dips` animations, `#map-desktop`/`#map-mobile`, `#footer` juggling, Barba cross-page & hash navigation, `spices.html` runners, `contact.html` form validation/submit/reset, and smooth 60fps scrolling at `1920x1080`, `1440x900`, and `390x844`.
- **Where We Left Off:** Full-site QA passed (`overflowX: false`, `0` hidden pops/broken images, `0` console errors).

### [Session 29 — Phone-Only Layout Fixes & `Contact` Navigation Fix]
- **Files Created/Modified:** `css/styles.css`, `js/app.js`, `index.html`, `menu.html`, `spices.html`, `contact.html`, `INSTRUCTION.md`
- **What Changed:**
  - **Fixed `#smsh-checkout-modal` Invisible Click-Intercept Bug (`index.html`, `menu.html`, `spices.html`, `contact.html`, `js/app.js`):** Removed permanent `pointer-events-auto` from `#smsh-checkout-modal`'s inner dialog card and hid `#smsh-checkout-modal` with `hidden` until opened in `openCheckoutModal` / re-hidden on `closeCheckoutModal` completion so closed modals cannot intercept taps over `#main-menu` (`CONTACT` link).
  - **Phone Navigation & Scroll Hardening (`css/styles.css`, `js/app.js`, all 4 HTML pages):** Added full-row `max-md:block max-md:w-full max-md:py-[1.4vw]` hit areas on `.menu-item-link`, `max-md:max-h-[75dvh] max-md:overflow-y-auto` on `#main-menu`, larger footer nav link padding (`max-md:py-2 max-md:px-1.5`, `max-md:pb-[10vw]`), mobile `touch-action: manipulation`, higher phone scroll delta before hiding `#navbar`, and Barba error redirect fallbacks.
  - **Phone-Only Layout & Overlap Fixes (`max-md:` only):** Tightened `#hero` spacing/text wrapping, eliminated `#about` fanned-card overflow (`overflow-x-clip`, `max-md:w-[26vw]`), kept `#ingredients` headlines crisp in front of corner-framed cutouts (`max-md:text-[18vw]`), replaced inline `style="height:6vw"` on `.menu-checker-band` with `h-[6vw] max-md:h-[14vw]`, repositioned CTA `burger-boy.webp` (`max-md:w-[27vw]`), and fixed `spices.html` hero seam/contrast/`#farmToBite` stickers.
- **Where We Left Off:** Verified in Playwright across `375x812`, `390x844`, and `1440x900` (`Contact` navigation via `#main-menu` & `<footer>`, contact form submission, `scrollWidth <= innerWidth`, `0` console errors).

### [Session 30 — Mobile `#storyofEveryBiteMobile` SVG Animations & Phone Heading Wave Clearance]
- **Files Created/Modified:** `index.html`, `spices.html`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Added Mobile `#storyofEveryBiteMobile` SVG & Card Animations (`spices.html`, `js/app.js`):** Added `#story-bite-mobile-path` (curved dashed `#F4A804` SVG path), 4 `[data-spice-mobile-runner="true"]` cutouts (`lettuce.webp`, `tomato.webp`, `cheese-logo.webp`, `meat.webp`), and `[data-spice-mobile-card="true"]` mobile captions across `#story-bite-mobile-stage` (`gap-[38vw]`), and wired mobile `MotionPathPlugin` segment glides, dashed `strokeDashoffset` scroll motion, and staggered card pop-in reveals inside `initSpicesPage` (`mm.add('(max-width: 767px)')`).
  - **Fixed Phone Heading Covered by `.jelly` Wave (`index.html`, `spices.html`, `js/app.js`):** Removed `space-y-[5vw]` on `#map-mobile` (`index.html`) and `#storyofEveryBiteMobile` (`spices.html`) where Tailwind's sibling specificity (`0,2,0`) overrode `mt-[30vw]` to `5vw` and tucked `"A STORY IN"` behind the top `.jelly` wave (`-66px` overlap). Switched heading wrappers to `pt-[32vw]` (`+36px`–`+37px` clearance below wave), added `[data-pop="true"]` + `[data-line-mask="true"]` to `#storyofEveryBiteMobile`, and set scroll trigger starts to `'top 94%'` / `'top 95%'` in `initScrollTextAnimations`.
- **Where We Left Off:** Verified in Playwright at `375x812`, `390x844`, and `1440x900` (`docScrollW <= innerW`, `0` console errors, `.playwright-mcp` cleaned up).

### [Session 31 — Centered `#preloader` Loading Burger Across Phone & Desktop]
- **Files Created/Modified:** `index.html`, `menu.html`, `spices.html`, `contact.html`, `js/app.js`, `INSTRUCTION.md`
- **What Changed:**
  - **Eliminated Double `-50%` Horizontal Shift:** Replaced `left-1/2 -translate-x-1/2 w-full` on all 6 `.preloader-layer`s per page with `left-0 w-full` and updated `gsap.set(layers, ...)` in `initPreloader` (`js/app.js`) to `xPercent: 0, x: 0`, preventing Tailwind `-translate-x-1/2` (`-50%`) + GSAP `xPercent: -50` from stacking to `-100%` (`burgerCx: 102px` on `375px` mobile).
  - **Vertical Centering:** Removed `mb-[8vw]` on `#preloader-burger-stage` across all 4 HTML pages so the burger stack centers vertically (`burgerCy: 444px` on `1440x900`, `burgerCy: 394px` on `375x812`).
- **Where We Left Off:** Verified in Playwright across `1440x900` (`burgerCx: 721, burgerCy: 444`) and `375x812` (`burgerCx: 188, burgerCy: 394–395` across `index.html` & `spices.html`) with `0` console errors.
