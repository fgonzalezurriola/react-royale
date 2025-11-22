# Frontend – React Royale

This frontend powers the hackathon experience for React Royale. Participants now build their submissions with **Sandpack**, the same stack used in production, and the gallery renders everything in a secure, read-only sandbox.

## Local development

```bash
cd frontend
pnpm install
pnpm dev
```

The dev server runs at http://localhost:5173 and proxies API calls to the backend.

## Sandpack starter template

The editable playground lives in `src/sandpack/` and mirrors the tools available in the real app:

- `App.jsx` – landing component that wires Zustand, motion, lucide icons, and Tailwind-friendly utility classes.
- `Counter.jsx` – example of a reusable component with motion animations.
- `store.js` – lightweight Zustand store demonstrating global state.
- `styles.css` – custom styles that can be imported anywhere inside Sandpack.

You can customize or add files directly from the embedded file explorer while keeping the entry point at `/App.jsx`.

## What participants can use

Inside Sandpack the following features are pre-installed and ready to go:

1. ✅ Multiple files & folders – structure components the way you do in real projects.
2. ✅ Zustand for global state – share state between components exactly like the main app.
3. ✅ Motion animations – craft delightful interactions with the `motion` package.
4. ✅ Lucide React icons – ship polished UI with the same icon set as production.
5. ✅ Tailwind-friendly styling – utility classes work out of the box.
6. ✅ Console integrada para debug – inspect logs without leaving the playground.
7. ✅ Hot reload instantáneo – every change shows up immediately.
8. ✅ TypeScript (opcional) – rename files to `.tsx` whenever you need extra type safety.

## Security guardrails

To keep the gallery safe for everyone we run static checks on every file before accepting a submission (see `security-rules.json`). The following APIs are blocked both in the browser and on the server:

- Network calls such as `fetch`, `XMLHttpRequest`, `WebSocket`, or `navigator.sendBeacon`.
- Direct DOM access (`window`, `document`, `parent`, `top`, `globalThis`).
- Storage and cookies (`localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`).
- Dynamic evaluation (`eval`, `Function`, string-based `setTimeout`/`setInterval`).
- Node.js internals (`require`, `process`, `fs`, `child_process`, `Buffer`).

If any of these APIs appear in a file the UI blocks the submission and the backend returns a 400 with detailed violations. See `security-rules.json` for the exact regexes.

## Key components

- `src/components/sandpack/SandpackWorkspace.tsx` – shared editor/viewer used in the submit form and detail pages.
- `src/components/sandpack/SandpackPreviewFrame.tsx` – lightweight preview used for cards and rankings.
- `src/utils/sandpackProject.ts` – serialization helpers to persist Sandpack files as a single string in the database.
- `src/utils/securityValidation.ts` – client-side validator that mirrors the backend checks.

## Testing

The backend ships a lightweight test suite (`pnpm --filter backend test`) that verifies the security validator rejects malicious snippets such as `fetch` calls and `document.cookie` reads. Add new tests whenever you tighten the sandbox.

---

Questions? Open an issue in this repo and include reproduction steps plus the code you attempted inside Sandpack.
