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

## Run locally

Open `index.html` directly, or:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Deploy to GitHub Pages

Push to a GitHub repo, then **Settings → Pages → Source: Deploy from a branch**, branch `master` (or `main`), folder `/ (root)`.

## Changing the date

Edit one line in `countdown.js`:

```js
const DEADLINE = Date.UTC(2027, 1, 26, 3, 0, 0); // month is 0-indexed
```

Then update the two human-readable copies of the date in `index.html` (hero `.deadline` and the "Service ends" fact).

## Notes

- One screen, no scrolling: `.screen` is a `100dvh` grid of bar / stage / footer, and every type size is clamped against both `vw` and `vh` so it holds on a phone in landscape and on a 1920-wide desktop.
- The Poké Ball is the vault door. Its seam runs along the deposit row and its button sits *in* the row, between hours and minutes.
- Dark, single-theme by design — the page is the inside of the vault.
- Grid tracks are `max-content`, not `auto`: `align-content: stretch` inflates `auto` tracks.
- Responsive from 320px up, keyboard focus visible, `prefers-reduced-motion` respected.
- The live region announces once a minute rather than once a second.
- Fan-made. Not affiliated with Nintendo, The Pokémon Company, or Game Freak.
