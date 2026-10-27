# ulyssetsd.github.io

Personal CV/resume website built with [JSON Resume](https://jsonresume.org/) and a custom theme.

## Stack

- **Data**: `resume.json` (JSON Resume standard)
- **Theme**: Custom `editorial-minimal` theme (sans-serif typography, clean layout)
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
Dockerfile               # Multi-stage: node build → nginx serve
k8s/                     # Kubernetes manifests (FluxCD)
.github/workflows/       # CI/CD: Docker build + push to GHCR
```
