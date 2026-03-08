# ulyssetsd.github.io

Personal CV/resume website built with [JSON Resume](https://jsonresume.org/) and a custom theme.

## Stack

- **Data**: `resume.json` (JSON Resume standard)
- **Theme**: Custom `editorial-minimal` theme (sans-serif typography, clean layout)
- **Build**: `resume-cli` generates static HTML + PDF (via Puppeteer)
- **Deploy**: Docker (nginx) → GHCR → Kubernetes (Raspberry Pi 5) via FluxCD
- **Domains**: [ulyssetassidis.fr](https://ulyssetassidis.fr) / [ulyssetsd.github.io](https://ulyssetsd.github.io)

## Development

```bash
npm install

# Preview in browser (live reload)
npm run preview

# Build HTML
npm run build

# Generate PDF
npm run pdf
```

## Project Structure

```
resume.json              # CV data (single source of truth)
themes/
  editorial-minimal/     # Custom theme (sans-serif, clean layout)
Dockerfile               # Multi-stage: node build → nginx serve
k8s/                     # Kubernetes manifests (FluxCD)
.github/workflows/       # CI/CD: Docker build + push to GHCR
```
