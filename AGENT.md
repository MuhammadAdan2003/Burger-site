# AGENT.md — Permanent Project Brain & Non-Negotiable Architecture Rules

> **Project:** **SMSH** | Artisan Smashed Burgers (1:1 Interactive & Visual Replica of `https://www.cravburgers.shop/`, rebranded as **SMSH**)
> **Mandatory Agent Protocol:**
> 1. **READ FIRST:** Before creating or modifying any file in any prompt, ALWAYS read `AGENT.md` and `INSTRUCTION.md` completely.
> 2. **STRICT CONSISTENCY:** Never invent new colors, never substitute generic fonts, and never alter or reorder sections away from the original site architecture documented below.
> 3. **ASK IF UNSURE:** If any requirement or interaction feels ambiguous, ask the user immediately rather than guessing.
> 4. **UPDATE BEFORE FINISHING:** At the end of EVERY prompt, update `INSTRUCTION.md` (Handoff Banner, Phase Checkboxes, and Changelog Logbook) so the next prompt knows the exact state where you left off.

---

## 1. Locked Tech Stack (Pure Vanilla — Zero Frameworks / Zero Build Step)

- **Markup:** Pure semantic Vanilla HTML5 (`index.html` — single-page flagship experience).
- **Styling:** Tailwind CSS CDN (`https://cdn.tailwindcss.com`) configured inline with the exact SMSH tokens + `css/styles.css` for custom stroke utilities, peelable sticker clip-paths, responsive `vw` typography classes, and Lenis rules.
- **Animation Engine (CDN):**
  - GSAP Core (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`)
  - GSAP ScrollTrigger (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`)
  - GSAP MotionPathPlugin (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js`) — used for the airplane flying along the SVG path in the Global Takeaway section.
- **Smooth Scrolling (CDN):**
  - Lenis (`https://unpkg.com/lenis@1.1.20/dist/lenis.min.js`) synced directly with `ScrollTrigger.update` and driven by `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `gsap.ticker.lagSmoothing(0)`.
- **JavaScript:** Clean, modular Vanilla ES6+ JavaScript (`js/app.js` or modular `js/*.js`), with zero React, zero Vite, and zero npm build requirements.

---

## 2. Strict Color Palette (Zero Deviation Allowed)

Extracted 1:1 from `cravburgers.shop`'s live stylesheet. **NEVER** use any Tailwind default grays (`gray-*`, `slate-*`), blues, purples, or unapproved colors.

### Core UI & Brand Tokens
| CSS Variable | Tailwind Token | Exact Hex | Usage |
| :--- | :--- | :--- | :--- |
| `--beige` | `beige` | `#F5E3CD` | Primary page background (`body`), light text on red surfaces, Hero/About/Ingredients/CTA/Footer canvas |
| `--red` | `red` | `#F91814` | Primary brand red: `SMSH` logo, display headlines, `Burgers` pill, Menu popover, Experience section bg |
| `--white` | `white` | `#FFFFFF` | Thick `-webkit-text-stroke` outlines, cartoon eye scleras, card frames, organic `"Order Now"` text |
| `--black` | `black` | `#1B1B1B` | Primary body copy, `Menu` pill border/bars, `Burgers` hover background, footer rules (`#1B1B1B` / `20%` alpha) |
| `--mustard` | `mustard` | `#FFD750` | Preloader progress bar, Menu link hover color, Global Takeaway (`#map`) section background |
| `--mustard-dark` | `mustard-dark` | `#F4A804` | Tilted `Modak` stamps (`SMASHED FRESH`, `BOLD FLAVOR`, `BOLD FLAVOUR`, `TAKE AWAY`), Hero `SMSH` watermark, `#F4A8044D` stroke |

### Approved Vector-Only Illustration Fills
Used **ONLY** inside the original preloader burger-stack SVGs,confetti dots, and liquid curtain wave SVGs (`./assets/svg/preloader-*.svg`):
- `#4C0016` (deep burger outline / wave layer 1), `#EF6F2E` (wave layer 2 / bun shadow), `#FF9D3F` (bun fill), `#FFC614` & `#ED900A` (cheese SVG), `#EF1624` & `#B21222` (tomato SVG), `#60A905` (lettuce confetti dot), `#C34F59` & `#AF3A3A` (patty SVG).

---

## 3. Strict Typography & Text-Stroke System

Import ONLY **`Modak`** and **`Mouse Memoirs`** from Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Modak&family=Mouse+Memoirs&display=swap" rel="stylesheet">
```

### Font Roles
1. **`font-modak` (`'Modak', cursive` — Weight 400):**
   - Giant `SMSH` brand wordmarks (Navbar `4vw`, Hero watermark `15vw`, Footer giant `35vw` `.heading600`).
   - Tilted floating section stamps (`SMASHED FRESH`, `BOLD FLAVOR`, `TOP CLASSIC`, `EXPERIENCE`, `BOLD FLAVOUR`, `PURE QUALITY`, `TAKE AWAY`, `FEEL IT`).
   - Dropdown menu links (`Home`, `About`, `Our Spices`, `Locations`, `Contact`) and City titles (`BERLIN`, `LONDON`, `NEW YORK`, `SYDNEY`, `TOKYO`).
2. **`font-mouse-memoirs` (`'Mouse Memoirs', sans-serif` — Weight 400):**
   - Default `body` font.
   - Giant condensed hero & section headlines (`THE BURGER` at `30vw`, `.heading300` at `15vw`, `.heading180` at `9vw`).
   - Editorial paragraphs (`.text96` `4vw`, `.text60` `2.8vw`, `.text40` `1.8vw`), pill buttons (`Burgers`, `Menu`, `Order Now`), nutritional callouts, and footer links.

### Mandatory Paint-Order Stroke Utilities (`css/styles.css`)
- `.text-stroke`: `-webkit-text-stroke: 2.5vw var(--white); paint-order: stroke fill;` (Giant `35vw` Footer `SMSH`)
- `.text-stroke-180`: `-webkit-text-stroke: 1vw var(--white); paint-order: stroke fill;` (Hero `THE BURGER`, tilted stamps, section `.heading300` titles)
- `.text-stroke-180-mustard`: `-webkit-text-stroke: 1vw rgba(244, 168, 4, 0.30); paint-order: stroke fill;` (`QUALITY THAT TRAVELS WITH YOU`)
- `.text-stroke-small`: `-webkit-text-stroke: 5px var(--white); paint-order: stroke fill;` (Navbar `SMSH`, city labels)

### Responsive Typography Breakpoint (`@media (max-width: 1025px)` / `max-md:`)
- `.self`: `padding: 8vw 2.5vw;` → mobile: `padding: 16vw 4vw;`
- `.heading600`: `font-family: 'Modak'; font-size: 35vw;`
- `.heading300`: `font-size: 15vw;` → `<=1025px`: `24vw` (with `max-md:` Tailwind overrides per section)
- `.heading180`: `font-size: 9vw;` → `<=1025px`: `14vw`
- `.text96`: `4vw` → `8vw` | `.text60`: `2.8vw` → `6.5vw` | `.text40`: `1.8vw` → `5vw`
- Enforce `overflow-x: hidden` (`overflow-x: clip`) on `html, body` so strokes or rotated stamps never cause horizontal scrollbars on `375px`, `768px`, `1280px`, or `1920px+`.

---

## 4. Signature Buttery GSAP Animations & Interactive Mechanics

Every section MUST implement the exact buttery animations from the reference site:

1. **Masked Text Line & Word Reveals (`overflow-hidden` mask wrappers):**
   - Paragraphs, subcopy, nutritional callouts, and section lines split into masked line/word wrappers (`overflow: hidden`) where inner `<span class="inline-block">` glides smoothly upward (`yPercent: 110 -> 0`, `opacity: 0 -> 1`, `power3.out` / `expo.out`) on `ScrollTrigger`.
2. **Elastic Pop-In Display Words (`[data-pop="true"]`):**
   - Giant display words (`THE` `BURGER`, `SMASHED` `FRESH`, `BOLD` `FLAVOR`, `SMSH`, `juicy` `cheesy` `fully` `Loaded`, `food` `that` `feels` `good`, `feel` `the` `Change`, and Footer `S` `M` `S` `H`) pop in with crisp scale + rotation + y-offset spring (`back.out(1.7)` / `elastic.out(1, 0.6)`), staggered cleanly.
3. **Double-Layer Vertical Split Hover Links:**
   - All nav pills (`Burgers`, `Menu`) and footer links use stacked `overflow-hidden` twin `<span>` layers (`translate-y-0 -> -translate-y-full` and `translate-y-full -> translate-y-0` on hover).
4. **Elastic `.jelly` Curved SVG Section Dividers:**
   - Smooth curved SVG transitions (`./assets/svg/jelly-divider.svg`) between `--beige`, `--red`, and `--mustard` sections whose quadratic/cubic control path subtly flexes with scroll velocity.
5. **Interactive Peelable Die-Cut Stickers (`.sticker-container`):**
   - `fries.webp`, `burger.webp`, and `burger-boy.png` use the dual-layer `.sticker-main` + mirrored `.flap` CSS polygon `clip-path` + `./assets/svg/sticker-filters.svg` lighting filters so hovering/dragging peels the corner realistically (`--peel-amount` animated via GSAP `power2.out`/`power3.out`).
6. **Cursor-Tracking Cartoon Googly Eyes:**
   - In the Experience section (`burgerwithhands.webp`), two oval scleras + animated `cartoon-eyebrow.svg` brows track `mousemove` across the viewport, rotating/translating the black pupils smoothly toward the pointer via `gsap.quickTo`.
7. **Custom `burgerselfie.png` Hover Follower Cursor:**
   - Fine-pointer desktops show a smooth GSAP `quickTo` floating `burgerselfie.png` sticker cursor when hovering interactive photo cards (`#about` cards & `#map` city cards), hidden automatically on `[data-cursor-hide="true"]` buttons and `pointer: coarse` touch devices.
8. **Footer Ingredient Juggle:**
   - Hovering or scrolling into the giant `35vw` Footer **`SMSH`** launches/juggles `lettuce.webp`, `tomato.webp`, `cheese-logo.webp`, and `meat.webp` upward from behind the letters with playful GSAP physics.

---

## 5. Complete Local `./assets/` Inventory (Already Downloaded Offline)

All 22 raster images and 12 exact vector SVGs are stored locally inside `./assets/` — **always reference `./assets/...` relative paths (never external URLs)**:

- **Cutouts & Photos (`./assets/img-webp/`):**
  - `burgerH.webp` (Hero main floating smash burger)
  - `about-1.webp`, `about-2.webp`, `about-3.webp` (About section 3 fanned photo cards)
  - `fries.webp`, `burger.webp` (Experience peelable retro character stickers)
  - `burgerwithhands.webp` (Experience hands holding burger under cartoon eyes)
  - `cheesyBurger.webp` (Full-bleed 160vh dripping cheese burger showcase)
  - `tomato.webp`, `cheese.webp`, `meat.webp`, `lettuce.webp`, `cheese-logo.webp` (Deconstructed `#ingredients` layers + Footer juggle cutouts)
  - `berlin.webp`, `london.webp`, `newyork.webp`, `sydney.webp`, `tokyo.webp` (5 Global Takeaway city cards)
  - `cta.webp` (CTA wooden board smash burger photo)
- **PNG Stickers & Characters (`./assets/img/`):**
  - `burgerselfie.png` (Interactive card-hover follower mascot)
  - `plane.png` (Global Takeaway flying airplane die-cut)
  - `burger-boy.png` (CTA giant peelable burger-boy die-cut sticker)
- **Exact Vector SVGs (`./assets/svg/`):**
  - `preloader-bun-bottom.svg`, `preloader-patty.svg`, `preloader-cheese.svg`, `preloader-tomato.svg`, `preloader-lettuce.svg`, `preloader-bun-top.svg`
  - `btn-blob.svg` (Organic `"Order Now"` button background)
  - `sticker-filters.svg` (`#pointLight`, `#pointLightFlipped`, `#expandAndFill`, `#dropShadow`)
  - `jelly-divider.svg` (Curved section wave divider)
  - `cartoon-eyebrow.svg` (Expressive eyebrow above googly eyes)
  - `story-winding-path.svg` (Desktop `#map-desktop` winding flight path)
  - `vertical-line.svg` (Mobile `#map-mobile` vertical flight path)

---

## 6. Locked Single-Page Section Order (Never Reorder or Alter)

1. **Preloader (`#preloader`)** — 3 liquid SVG waves (`#4C0016`, `#EF6F2E`, `#F91814`), 6-layer animated SVG burger assembly + 14 confetti dots, `"PREPARING ARTISAN KITCHEN..."`, bottom `--mustard` progress bar, curved SVG wave reveal.
2. **Navbar & Popover Menu (`#navbar` + `#main-menu`)** — Fixed top bar (`SMSH` logo, `Burgers` red pill -> scrolls to `#ingredients`, `Menu` outlined pill -> scales open `#main-menu` red card with `Home`, `About`, `Our Spices`, `Locations`, `Contact` + `Est. 1997 — Navarra, España` + blurred `bg-red/30` backdrop).
3. **Hero (`#hero` — `bg-beige`)** — `THE BURGER` (`30vw` red stroked), tilted `SMASHED FRESH` & `BOLD FLAVOR` stamps, center floating `burgerH.webp`, `15vw` `SMSH` mustard-dark wordmark, bottom left/right masked copy.
4. **Brand Story / About (`#about` — `bg-beige`)** — `TOP CLASSIC` stamp, `JUICY CHEESY FULLY LOADED` (`heading300`), masked SMSH intro paragraph, organic blob `Order Now` button, 3 tilted/fanned parallax cards (`about-1..3.webp`).
5. **Experience & Cheesy Showcase (`#experience` — `bg-red` + `cheesyBurger.webp`)** — Top `.jelly` wave, peelable `fries.webp` & `burger.webp` stickers, `EXPERIENCE` stamp + `FOOD THAT FEELS GOOD`, `burgerwithhands.webp` with live cursor-tracking cartoon eyes/eyebrows, `450 kcal / High Protein / Fresh Ingredients`, `BOLD FLAVOUR` stamp, `100% Organic / Zero Guilt / True Taste`, followed by `160vh` full-bleed `cheesyBurger.webp` between `.jelly` waves.
6. **Deconstructed Ingredients (`#ingredients` — `bg-beige`)** — `PURE QUALITY` stamp, 4 stacked `heading300` masked lines (`EVERY LAYER / PACKED WITH / SIGNATURE / FLAVOR`), and 4 ScrollTrigger-scrubbed floating cutouts (`tomato.webp`, `cheese.webp`, `meat.webp`, `lettuce.webp`).
7. **Global Takeaway Flight Map (`#map-section`: `#map-desktop` & `#map-mobile` — `bg-mustard`)** — Top `.jelly` wave into `#FFD750`, `TAKE AWAY` stamp, `QUALITY THAT TRAVELS WITH YOU`, winding `story-winding-path.svg` drawn on scroll with `plane.png` flying via `MotionPathPlugin` past `BERLIN`, `LONDON`, `NEW YORK`, `SYDNEY`, `TOKYO` cards (plus clean vertical flight layout on mobile).
8. **CTA Banner & Kinetic Footer (`#cta` + `#footer` — `bg-beige`)** — Top `.jelly` wave into `#F5E3CD`, peelable `burger-boy.png` sticker, `FEEL IT` stamp, `FEEL THE CHANGE`, masked copy, blob `Order Now` button, `cta.webp` wooden board burger; followed by `#footer` links, `© 2026 SMSH — All rights reserved`, `Smashed patties · toasted buns · est. 1997`, and giant `35vw` `SMSH` with juggling ingredient cutouts.

