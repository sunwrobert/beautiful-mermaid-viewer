# Beautiful Mermaid Viewer

A live mermaid diagram editor and viewer powered by [beautiful-mermaid](https://agents.craft.do/mermaid). Paste mermaid syntax on the left, see the rendered diagram on the right.

## Features

- **Live preview** — diagrams render as you type (debounced for performance)
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
