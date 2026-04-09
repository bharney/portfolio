# GitHub Copilot Instructions — Portfolio (bharney.com)

## Project Overview

React 18 + Express 4 portfolio site with streaming SSR, bundled with Webpack 5, styled with Bootstrap 5 + custom SCSS. TypeScript everywhere.

## Commands

**All commands must be run from the repository root.** Always use the scripts defined in `package.json` — do not invoke tools like `webpack`, `nodemon`, or `node dist/app.js` directly.

```bash
npm install              # install dependencies
npm run start:server     # full-stack dev server (Webpack watch + Nodemon) → localhost:9000
npm run start:client     # client-only Webpack Dev Server with HMR (no SSR)
npm run build            # production build → ./dist
npm run test:client      # run Jest tests
npm run lint             # ESLint across .ts files
npm run prettier         # auto-format source files
npm run images:webp      # convert images to WebP via Sharp
npm run analyze          # production build + Bundle Analyzer
```

### `npm run start:server` — Primary Development Command

`npm run start:server` runs an initial Webpack build, then starts two parallel processes:
1. **Webpack in watch mode** — recompiles client + server bundles on file changes
2. **Nodemon** — watches `dist/app.js` and `dist/public/index.html`, restarts Express

Site is available at **http://localhost:9000** with full SSR.

## Project Structure

```
src/
  client/          React app, components, Redux store, styles, images
    components/    Page-level and shared UI components
    store/         Redux Toolkit slices
    styles/        SCSS source files
  server/          Express server, SSR middleware
    ssr/           Streaming SSR (renderToPipeableStream)
    middleware/    React SSR middleware, error handling, routing
  shared/          Models and types shared between client and server
tests/             Jest tests (client/, server/, shared/)
scripts/           Utility scripts (e.g. image conversion)
dist/              Build output (not checked in)
```

## Code Style

- TypeScript for all source code — no plain `.js` in `src/`
- React functional components with hooks (no class components)
- Redux Toolkit (`createSlice`, `configureStore`) for state management
- Font Awesome icons imported individually for tree-shaking
- Bootstrap 5 via SCSS partial imports — never the full CSS
- Environment globals `__PRODUCTION__` and `__SERVER__` injected by Webpack DefinePlugin

## Testing

- Tests are in `tests/` with `.spec.ts` / `.spec.tsx` extensions
- Run with `npm run test:client`
- Jest config: `jest.config.ts` — preset `ts-jest`, environment `node`

## Critical CSS

`src/client/index.html` contains ~700 lines of inline critical CSS. When changing above-the-fold styles, update **both** the SCSS source and the inline `<style>` block in `index.html`.

## Deployment

Pushes to `main` trigger GitHub Actions (`.github/workflows/main_bharney.yml`) → Azure Web App.

## Boundaries

- ✅ Always: run commands from the repo root, use `package.json` scripts (never invoke tools directly), use `npm run start:server` for local dev, run tests before committing, keep critical CSS in sync
- ⚠️ Ask first: adding dependencies, modifying webpack config, changing CI/CD workflow
- 🚫 Never: commit secrets or API keys, import full Font Awesome or full Bootstrap CSS, modify `dist/` or `node_modules/`
