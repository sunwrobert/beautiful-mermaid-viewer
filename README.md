# Beautiful Mermaid Viewer

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://beautiful-mermaid-viewer.sunwrobert.workers.dev/)
[![GitHub](https://img.shields.io/github/stars/sunwrobert/beautiful-mermaid-viewer?style=social)](https://github.com/sunwrobert/beautiful-mermaid-viewer)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A live mermaid diagram editor and viewer powered by [beautiful-mermaid](https://agents.craft.do/mermaid). Paste mermaid syntax on the left, see the rendered diagram on the right.

**[Try it live](https://beautiful-mermaid-viewer.sunwrobert.workers.dev/)** | [Open with a demo diagram](https://beautiful-mermaid-viewer.sunwrobert.workers.dev/#Z3JhcGggVEQKICAgIEFbU3RhcnRdIC0tPiBCe0lzIGl0IHdvcmtpbmc_fQogICAgQiAtLT58WWVzfCBDW0dyZWF0IV0KICAgIEIgLS0-fE5vfCBEW0RlYnVnXQogICAgRCAtLT4gQg)

## Features

- **Live preview** — diagrams render as you type (debounced for performance)
- **Shareable URLs** — diagrams are encoded in the URL hash, click "Copy Link" to share
- **Resizable split pane** — drag the divider to resize editor and preview panels, persisted to localStorage
- **Zoom controls** — zoom in/out and reset on the preview panel
- **Light/dark mode** — toggle between light and dark themes (tokyo-night for dark), respects OS preference on first visit, persisted to localStorage
- **Synchronous rendering** — uses beautiful-mermaid for instant, zero-flash SVG output

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Lint with ESLint |
| `pnpm format` | Format with Prettier |

## Tech Stack

- [Foldkit](https://github.com/foldkit/foldkit) — Elm Architecture framework on Effect-TS
- [beautiful-mermaid](https://agents.craft.do/mermaid) — Synchronous mermaid diagram rendering
- [Tailwind CSS](https://tailwindcss.com) v4
- [Vite](https://vite.dev) v7
- [TypeScript](https://www.typescriptlang.org) v5

## License

MIT
