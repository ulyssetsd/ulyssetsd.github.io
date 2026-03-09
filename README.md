# ulyssetsd.github.io

Personal CV/resume website built with [JSON Resume](https://jsonresume.org/) and multiple custom themes.

## Stack

- **Data**: `resume.json` (JSON Resume standard)
- **Themes**: 8 custom themes (5 sober + 3 bold/experimental)
- **Build**: `resume-cli` generates static HTML + PDF (via Puppeteer)
- **Deploy**: Docker (nginx) → GHCR → Kubernetes (Raspberry Pi 5) via FluxCD
- **Domains**: [ulyssetassidis.fr](https://ulyssetassidis.fr) / [ulyssetsd.github.io](https://ulyssetsd.github.io)

## Themes

| Theme | Style | Key features |
|-------|-------|-------------|
| **editorial-minimal** | Sans-serif, blue accent | Default — clean single-column, ATS-friendly |
| **press** | Serif (Playfair Display), red accent | Newspaper aesthetic, diamond ornaments, pull-quote |
| **compact** | System sans-serif, monochrome | Ultra-dense, fits on one A4 page, inline skills |
| **swiss** | Helvetica stack, red accent | International typographic style, date-content grid, uppercase headers |
| **warm** | DM Serif Display, terracotta | Cream background, centered header, 2-col skills |
| **terminal** | Monospace, green-on-black | Hacker terminal, ASCII skill bars, CRT effect |
| **infographic** | Sans-serif, multicolor | Dashboard with sidebar, timeline, stat counters |
| **glassmorphism** | Sans-serif, gradient | Frosted glass cards, blur effects, animations |

## Development

```bash
npm install

# Preview a theme in browser (live reload)
npm start                    # default (editorial-minimal)
npm run start:press          # press theme
npm run start:compact        # compact theme
npm run start:swiss          # swiss theme
npm run start:warm           # warm theme
npm run start:terminal       # terminal theme
npm run start:infographic    # infographic theme
npm run start:glassmorphism  # glassmorphism theme

# Build default theme (HTML + PDF)
npm run build

# Build a single theme (HTML + PDF into public/<theme>/)
npm run build:editorial
npm run build:press
npm run build:compact
npm run build:swiss
npm run build:warm
npm run build:terminal
npm run build:infographic
npm run build:glassmorphism

# Build all themes at once
npm run build:all

# Preview all built themes + theme picker
npx serve public -l 3000
# → http://localhost:3000/picker.html
```

## Project Structure

```
resume.json              # CV data (single source of truth)
themes/
  _shared/               # Shared helpers (formatDate, esc)
  editorial-minimal/     # Sober — sans-serif, blue accent
  press/                 # Sober — serif, newspaper layout
  compact/               # Sober — ultra-dense monochrome
  swiss/                 # Sober — Helvetica, date grid, red accent
  warm/                  # Sober — serif titles, cream/terracotta
  terminal/              # Bold — dark terminal aesthetic
  infographic/           # Bold — dashboard with sidebar
  glassmorphism/         # Bold — frosted glass cards
public/
  picker.html            # Theme gallery / picker page
  index.html             # Default build output
Dockerfile               # Multi-stage: node build → nginx serve
nginx.conf               # Theme subdirectory routing
k8s/                     # Kubernetes manifests (FluxCD)
```
