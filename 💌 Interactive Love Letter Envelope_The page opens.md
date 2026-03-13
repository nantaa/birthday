<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 💌 Interactive Love Letter Envelope

The page opens with an animated envelope that the girlfriend clicks to "open," revealing a folded letter with handwritten-style font, floating hearts, and a personalized message.​
give me  full design spec, component breakdown, color palette, file structure. i'll execute later , deployed on vps

Here’s a complete, implementation-ready spec for the **Interactive Love Letter Envelope** site, optimized for a simple HTML/CSS/JS stack you can host on your VPS. The interaction pattern closely follows common envelope‑opening love card demos built with HTML/CSS/JS and floating hearts.[^1][^2][^3]

***

## Concept overview

A **single-page microsite**:

1. Landing view: centered closed envelope with subtle idle animation over a soft gradient background.
2. On click: envelope opens with a smooth CSS animation, letter slides up, hearts float upward.[^2]
3. Final state: full letter visible with handwritten font, your custom message, optional small photo, replay button.

Target: mobile-first, looks great from ~360px wide up to desktop; no scroll required unless you add extra sections.

***

## User flow

1. User opens URL → sees closed envelope, “Tap to open your birthday letter” text.
2. User taps/clicks envelope → opening animation + hearts animating + letter sliding up.[^2]
3. After animation finishes, the letter is fully readable, with your message, name, date, optional button (“Play our song”).
4. User can:
    - Click “Close \& replay” to re-run the animation.
    - (Optional) Click “Play music” toggle.

***

## Design specification

### Layout

- Full viewport container:
    - Display: flex; flex-direction: column; justify-content: center; align-items: center;
    - Min-height: 100vh; padding: 16–24px.
- Envelope + letter stack:
    - Position: relative; width: clamp(260px, 70vw, 420px); aspect-ratio ~ 4 / 3.
    - Envelope is at the bottom (z-index lower), letter slides out above.
- Call-to-action text:
    - Positioned below the envelope on initial state, fades out when opened.


### Animations

Use CSS keyframes plus one JS class toggle (e.g., `.is-open`).

1. **Idle envelope hover / pulse**
    - Subtle scale $1 \rightarrow 1.02 \rightarrow 1$ and box-shadow pulsing every 3–4 seconds.
2. **Open envelope**
    - Top flap rotates around its bottom edge:
        - `transform-origin: bottom center;`
        - Keyframe `0%: rotateX(0deg) → 100%: rotateX(-140deg)`.
    - Duration: 0.8–1.0s, cubic-bezier easing.
3. **Letter slide**
    - Letter starts hidden behind envelope (`transform: translateY(40%)`, opacity 0).
    - After ~0.3s delay from envelope start, animate to `translateY(-10%)`, opacity 1 over 0.7–0.9s.
4. **Floating hearts**
    - Absolutely positioned small heart elements generated with JS or a few pseudo-elements.
    - Each uses keyframes like:
        - `0%: transform: translateY(0) scale(0.6); opacity: 0;`
        - `10%: opacity: 1;`
        - `100%: transform: translateY(-120px) translateX(random) scale(1); opacity: 0;`
    - Staggered via different `animation-delay` to create random effect.[^1][^2]
5. **Replay**
    - Remove `.is-open` class, force reflow, re-add class to replay animation.

### Typography

Use two Google Fonts or self-hosted equivalents:

- Heading / envelope text:
    - Sans-serif: e.g., Poppins / Inter, `font-weight: 500–600`.
- Letter body:
    - Handwritten script: e.g., “Pacifico”, “Dancing Script”, or “Great Vibes”.[^4][^2]
    - Line-height: 1.6; font-size: 1rem–1.1rem on mobile, 1.1–1.2rem on desktop.


### Content structure (letter)

Inside the visible letter:

- Small title: “To my favorite person,”
- 3–6 short paragraphs (keep lines short for mobile).
- Signature: right-aligned “With love, [Your Name]”.
- Optional:
    - Tiny circular avatar / couple photo near the top-right.[^5]
    - Date or “Happy Birthday [Name]” footer.

***

## Color palette

Romantic but not too childish; aim for soft pastels with contrast.

**Base palette (you can adjust names but keep roles):**

- Background gradient:
    - `--bg-start: #ffeef5` (soft pink)
    - `--bg-end: #fff9f0` (warm cream)
- Envelope:
    - `--envelope-base: #ffffff`
    - `--envelope-shadow: rgba(0, 0, 0, 0.08)`
    - `--envelope-line: #f3c5d1`
- Accent (hearts, buttons, key highlights):
    - `--accent: #ff5c8a` (romantic pink)
    - `--accent-soft: #ffc2d1`
- Text:
    - `--text-main: #35263a` (deep warm gray)
    - `--text-muted: #7d6b7f`

Accessibility note: ensure contrasts on buttons and body text are sufficient (accent on white, dark text on pale background).

***

## Component breakdown

Describe them generically; you can map them to React components later if you want.

### 1. Root layout (`App` / `index.html` body)

- Responsibilities:
    - Set gradient background.
    - Center the envelope module.
    - Manage global fonts and base styles.
- Key elements:
    - `<main class="page">`
    - Inside: `<section class="card-container">` with envelope, letter, CTA text.


### 2. Envelope component (`.envelope`)

- Structure:

```html
<div class="envelope">
  <div class="envelope__back"></div>
  <div class="envelope__front"></div>
  <div class="envelope__flap"></div>
  <div class="envelope__seal-heart"></div>
</div>
```

- Behavior:
    - On click (on `.envelope` wrapper or parent `.card`):
        - Add class `.is-open` to root wrapper.
    - CSS selectors animate flap and letter based on `.is-open`.


### 3. Letter component (`.letter`)

- Structure:

```html
<div class="letter">
  <div class="letter__inner">
    <p class="letter__eyebrow">To my love,</p>
    <h1 class="letter__title">Happy Birthday, [Her Name]</h1>
    <p class="letter__body">...</p>
    <p class="letter__body">...</p>
    <p class="letter__signature">With love,<br />[Your Name]</p>
  </div>
</div>
```

- Behavior:
    - Initially positioned behind envelope (`z-index` lower + translateY).
    - Slides up and fades in when `.is-open` applied.


### 4. Hearts overlay (`.hearts-layer`)

- Structure:

```html
<div class="hearts-layer">
  <!-- JS injects .heart elements -->
</div>
```

- Implementation:

```
- JS creates e.g. 10–20 `<span class="heart"></span>` with random `left` and `animation-delay`.
```

    - CSS keyframes handle float-up animations.[^1][^2]


### 5. CTA \& controls (`.controls`)

- Elements:

```html
<div class="controls">
  <p class="hint">Tap the envelope to open your birthday letter</p>
  <button class="btn btn-replay" hidden>Replay</button>
  <button class="btn btn-audio" hidden>Play music</button>
</div>
```

- Behavior:
    - When letter opens, hide `.hint`, show `Replay` (and optionally `Play music`).
    - `Replay`:
        - Remove `.is-open`, reset animations, re-show hint after short delay.
    - `Play music` (optional):
        - Toggles HTML `<audio>` playback.


### 6. Optional audio module

- HTML:

```html
<audio id="bg-music" preload="auto" loop src="assets/audio/your-song.mp3"></audio>
```

- JS:
    - Button toggles `play()` / `pause()` with icon change.
    - Start paused to avoid autoplay restrictions.

***

## File structure (simple static site on VPS)

Assuming Nginx or Apache serving static files:

```text
/var/www/love-letter/
  index.html
  /assets
    /css
      style.css
    /js
      main.js
    /img
      bg-texture.png       # optional
      heart.svg
      avatar.jpg           # optional
    /fonts                 # if you self-host fonts instead of Google Fonts
      ...
```


### `index.html`

- Contains:
    - `<head>`: meta tags, title, OG tags (for link preview), font links.

```
- `<body>`: main layout, envelope, letter, hearts layer, controls, `<audio>` tag.
```

- Minimal JS script tag to include `assets/js/main.js`.


### `assets/css/style.css`

- Sections:
    - CSS variables for colors, spacing, font families.
    - Global reset + base typography.
    - Layout styles for `.page`, `.card-container`.
    - Envelope geometry:
        - Use borders and transforms to create triangular flap and envelope body.[^3][^6]
    - Letter card (border-radius, shadow).
    - Hearts animations (`@keyframes float-heart` etc.).
    - State-based styles for `.is-open`.


### `assets/js/main.js`

- Responsibilities:
    - Add event listeners to:
        - Envelope / card click → toggle `is-open` state.
        - Replay button → reset classes.
        - Audio button → toggle background music.
    - Initialize hearts:
        - Dynamically create `.heart` elements and append to `.hearts-layer`.
        - Randomize horizontal positions and animation delays.
- Basic logic sketch:
    - `const card = document.querySelector('.card');`
    - `card.addEventListener('click', openCard);`
    - Use a boolean to prevent re-triggering while already open.


### `assets/img/`

- `heart.svg` or PNG for heart shape, or build hearts purely with CSS (two circles + square rotated).[^7]
- Optional background texture for subtle noise.

***

## Execution notes on VPS

Very brief since you’ll handle it:

1. Develop locally:
    - Open `index.html` with Live Server / simple HTTP server.
    - Tweak animations and content.
2. Deploy:
    - Copy project folder to `/var/www/love-letter/` via `scp` or Git pull.
3. Configure Nginx (example):
    - Add a server block pointing to that root, `index index.html;`.
4. Secure:
    - Use your existing domain and Let’s Encrypt for HTTPS.

If you tell me your preferred stack (plain HTML, React, Next.js, etc.), I can next generate a concrete code skeleton for `index.html`, `style.css`, and `main.js` that matches this spec exactly.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://dev.to/vaibhav_rathod_51969d61cb/envelope-of-love-1ch7

[^2]: https://www.sourcecodester.com/htmlcss/17910/valentines-e-letter-card-using-html-css-and-javascript-source-code.html

[^3]: https://www.youtube.com/watch?v=Xr7qGWMNGHw

[^4]: https://www.canva.com/cards/templates/love/

[^5]: https://justmeantforyou.com

[^6]: https://www.youtube.com/watch?v=q7F_0WJJD7g

[^7]: https://purecode.ai/community/htmlanimatedloveletter-tailwind-loveletter

[^8]: https://www.eventkingdom.com/browse/cards/love.ek

[^9]: https://ai.mobirise.com/sites/romantic-interactive-birthday-website-love-letter-5yENECIJV0C7BewF6BZFD.html

[^10]: https://sendomatic.com/blog/animated-envelope-invitations/

[^11]: https://www.greetingsisland.com/sobres/birthday

[^12]: https://www.smilebox.com/maker/card-maker/animated/birthday/

[^13]: https://www.2-luv.com/en/event/birthday

[^14]: https://lovetales.ai/tools/love-letter-generator

[^15]: https://gifft.me/create/happy-birthday

