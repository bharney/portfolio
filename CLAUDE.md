# Portfolio — bharney.com

See `AGENTS.md` in the repo root for full project context (tech stack, structure, all commands, code style, and boundaries). Everything in that file applies here too — this file adds Claude-specific guidance.

## Quick Reference

**All commands must be run from the repository root.** Always use `package.json` scripts — never invoke tools directly.

```bash
npm install              # install deps
npm run start:server     # full-stack dev (Webpack watch + Nodemon) → localhost:9000
npm run build            # production build → ./dist
npm run test:client      # Jest tests
npm run lint             # ESLint
```

For local development, use `npm run start:server` — it builds, watches, and restarts automatically.

## Architecture Notes

- **Streaming SSR:** `src/server/ssr/renderReactStream.tsx` uses `renderToPipeableStream`. The HTML template is split at `<div id="root">`, head is sent in `onShellReady`, React streams into the div, closing markup sent in `onAllReady`.
- **Dual Webpack configs:** `webpack.config.ts` exports an array of `[clientConfig, serverConfig]`. The server config uses `css-loader` with `exportOnlyLocals: true` (no DOM needed). The client config uses `style-loader` in dev and `MiniCssExtractPlugin` in production.
- **DefinePlugin globals:** `__PRODUCTION__` and `__SERVER__` are booleans injected at build time. Use them for environment branching. They're declared in `src/shared/types.d.ts`.

## Critical CSS — Dual Maintenance Required

`src/client/index.html` has ~700 lines of inline critical CSS. When changing above-the-fold styles, update **both** the SCSS source and the inline `<style>` block. Read `AGENTS.md` for details.

## How I Want Things Done

- Prefer small, focused changes — don't refactor unrelated code
- Show me the plan before editing multiple files
- When fixing a bug, explain the root cause before the fix
- Use existing patterns from the codebase (e.g., Redux slices follow `createSlice`, components are functional with hooks)
- Run `npm run test:client` after changes to verify nothing breaks

## Tools Available

- **Perplexity MCP** — configured in `.vscode/mcp.json` for research queries

## Boundaries

- ✅ Always: run from repo root, use `package.json` scripts (never invoke tools directly), use `npm run start:server` for local dev, keep critical CSS in sync, run tests
- ⚠️ Ask first: new dependencies, webpack config changes, CI/CD changes
- 🚫 Never: commit secrets, import full Font Awesome/Bootstrap, edit `dist/` or `node_modules/`
