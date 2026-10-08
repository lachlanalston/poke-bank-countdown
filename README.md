# Pokémon Bank countdown

Static, dependency-free countdown to **Pokémon Bank and Poké Transporter end of service**:
**Friday 26 February 2027, 2:00 pm AEDT** (`2027-02-26T03:00:00Z`).

Source for the date: [Nintendo Australia — Pokémon Bank end of service](https://www.nintendo.com/au/support/articles/pokemon-bank-end-of-service/)

## Files

| File | Purpose |
|------|---------|
| `index.html` | The whole page |
| `styles.css` | Vault-interior theme (Bank blue, vault steel, Bank-logo gold) |
| `countdown.js` | Countdown logic; `DEADLINE` is the single source of truth |
| `.nojekyll` | Stops GitHub Pages running files through Jekyll |
| `robots.txt` | Opens the site to search and AI crawlers, points at the sitemap |
| `sitemap.xml` | Single-URL sitemap |
| `og.png` | 1200x630 social card, rendered from the page itself |

## Run locally

Open `index.html` directly, or:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Deploy to GitHub Pages

Push to a GitHub repo, then **Settings → Pages → Source: Deploy from a branch**, branch `master` (or `main`), folder `/ (root)`.

## SEO

The page carries a canonical URL, Open Graph and Twitter card tags, and a JSON-LD `@graph` with `WebSite`, `WebPage` and a four-question `FAQPage`. The FAQ answers are the ones people actually search for — when it shuts down, what happens to Pokémon left behind, how to move them, whether Bank can still be downloaded — which is what search engines and LLM crawlers lift.

`og.png` deliberately shows the **date**, not the live countdown, so a cached social preview never goes stale. Regenerate it after a design change:

```bash
python3 -m http.server 8000 &
firefox --headless --window-size=1200,630 --screenshot="$PWD/og.png" http://127.0.0.1:8000/
```

## Changing the date

Edit one line in `countdown.js`:

```js
const DEADLINE = Date.UTC(2027, 1, 26, 3, 0, 0); // month is 0-indexed
```

Then update the human-readable copies of the date in `index.html`: the hero `.deadline` line, the `description` meta, the Open Graph and Twitter tags, and the JSON-LD answers.

## Notes

- One screen, no scrolling: `.screen` is a `100dvh` grid of bar / stage / footer, and every type size is clamped against both `vw` and `vh` so it holds on a phone in landscape and on a 1920-wide desktop.
- The Poké Ball is the vault door. Its seam runs along the deposit row and its button sits *in* the row, between hours and minutes.
- Dark, single-theme by design — the page is the inside of the vault.
- Grid tracks are `max-content`, not `auto`: `align-content: stretch` inflates `auto` tracks.
- Responsive from 320px up, keyboard focus visible, `prefers-reduced-motion` respected.
- The live region announces once a minute rather than once a second.
- Fan-made. Not affiliated with Nintendo, The Pokémon Company, or Game Freak.
