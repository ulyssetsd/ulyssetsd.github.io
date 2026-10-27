# ulyssetsd.github.io

Personal CV/resume website built with [JSON Resume](https://jsonresume.org/) and a custom theme.

## Stack

- **Data**: `resume.json` (JSON Resume standard)
- **Themes**: `editorial-minimal` plus four typography-focused alternatives
- **Build**: `resume-cli` generates static HTML + PDF (via Puppeteer)
- **Deploy**: Docker (nginx) → GHCR → Kubernetes (Raspberry Pi 5) via FluxCD
- **Domains**: [ulyssetassidis.fr](https://ulyssetassidis.fr) / [ulyssetsd.github.io](https://ulyssetsd.github.io)

## Development

Use Node.js 22, matching CI.

```bash
npm ci

# Preview in browser
npm start

# Build HTML and PDF
mkdir -p public
npm run build

# Rebuild either output separately
npm run build:html
npm run build:pdf

# Build the four alternatives and comparison gallery
npm run build:themes
npm run check:themes
```

On Linux with a system Chromium installation (including Raspberry Pi), install
dependencies and build using that browser:

```bash
PUPPETEER_SKIP_DOWNLOAD=true npm ci
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
mkdir -p public
npm run build
```

The theme uses an A4 print layout and a responsive screen layout. Before publishing
content changes, inspect `public/resume.pdf` for readability and page breaks, and
check `public/index.html` on desktop and mobile.

## Alternative themes

Open `public/themes/index.html` to compare all four proposals. Each has a full HTML
resume, a PDF and a preview image, generated from the same `resume.json`.

| Theme | Typography and layout |
| --- | --- |
| Folio | Source Serif 4, an editorial reading column and ink-blue headings |
| Suisse | Inter, a strong typographic grid and section names in the margin |
| Dossier | A split masthead, dates in a side column and blue-green accents |
| Lettre | A centered masthead, italic serif section headings and a classic layout |

The current theme remains at `public/index.html`. The alternatives are also
standalone JSON Resume themes, for example:

```bash
npx resume export public/folio.html --theme ./themes/folio
npx resume export public/folio.pdf --theme ./themes/folio
```

Shared markup in `themes/_shared/render.js` keeps the content consistent across the
alternatives; each theme has its own stylesheet. Fonts are bundled and embedded in
the generated HTML, so previews and PDF builds do not request external font assets.
Their original licenses and download sources are in `themes/_shared/fonts/`.

`npm run check:themes` verifies that recorded details and technologies are visible
in every alternative, that gallery links work, and that the layouts fit four screen
widths. CI runs these checks and includes all generated files in the `site` artifact.

## Content maintenance

`resume.json` is the complete career record, including older roles, projects,
technologies, education, languages, interests and references. Preserve the recorded
facts when editing for clarity. There is no page-count target; keep the full record
visible in both HTML and PDF.

Store each role's technologies in its `keywords` array. The theme displays them
under **Technologies**, so a separate `Technologies:` bullet in `highlights` is
unnecessary. Project `highlights` and `keywords` are displayed as well. Keep dates,
links and implementation details when reorganizing this information.

## Project Structure

```
resume.json              # CV data (single source of truth)
themes/
  editorial-minimal/     # Custom theme (sans-serif, clean layout)
  folio/                 # Editorial serif
  suisse/                # Typographic grid
  dossier/               # Chronological side column
  lettre/                # Centered classic layout
  _shared/               # Content renderer, base styles and bundled fonts
scripts/                 # Alternative-theme build and browser checks
Dockerfile               # nginx serves the pre-built site
k8s/                     # Kubernetes manifests (FluxCD)
.github/workflows/       # CI/CD: Docker build + push to GHCR
```
