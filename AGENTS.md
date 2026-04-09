# Portfolio — bharney.com

Personal portfolio site built with server-side rendered React on Express, bundled with Webpack, and styled with Bootstrap 5 + custom SCSS.

## Tech Stack

- **Language:** TypeScript 4.5
- **UI:** React 18, React Router 6, Redux Toolkit
- **Server:** Express 4 with streaming SSR (`renderToPipeableStream`)
- **Styling:** Bootstrap 5 (custom partial import), SCSS, PostCSS with PurgeCSS
- **Bundling:** Webpack 5 (separate `client` and `server` configs exported as an array)
- **Testing:** Jest 27, SuperTest
- **Icons:** Font Awesome 6 (tree-shaken individual imports)
- **CI/CD:** GitHub Actions → Azure Web App

## Commands

**All commands must be run from the repository root.** Always use the scripts defined in `package.json` — do not invoke tools like `webpack`, `nodemon`, or `node dist/app.js` directly.

| Command                  | What it does                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| `npm install`            | Install all dependencies                                            |
| `npm run start:server`   | Full-stack dev server (Webpack watch + Nodemon) at `localhost:9000` |
| `npm run start:client`   | Client-only Webpack Dev Server with HMR (no SSR)                    |
| `npm run build`          | Production build (optimised, minified) → `./dist`                   |
| `npm run test:client`    | Run Jest test suites                                                |
| `npm run lint`           | ESLint across `.ts` files                                           |
| `npm run prettier`       | Auto-format source files                                            |
| `npm run images:webp`    | Convert images to WebP via Sharp                                    |
| `npm run analyze`        | Production build + Webpack Bundle Analyzer                          |

### `npm run start:server` — the primary local development command

```bash
npm run start:server
```

This runs `webpack` for an initial build, then starts two parallel processes via `concurrently`:
1. **Webpack in watch mode** — recompiles client + server bundles on file changes → `./dist`
2. **Nodemon** — watches `dist/app.js` and `dist/public/index.html`, restarts Express on rebuild

Site is available at **http://localhost:9000** with full SSR.

## Project Structure

```
src/
  client/          React app, components, Redux store, styles, images
    components/    Page-level and shared UI components
    store/         Redux Toolkit slices (Account, Alert, Profile, Session)
    styles/        SCSS source (bootstrap-custom.scss, styles.scss, etc.)
    images/        Static images (png, jpg, webp)
    fonts/         Self-hosted web fonts
    models/        Client-side TypeScript interfaces
    utils/         Client utilities (cookies, tokens, parallax)
  server/          Express server, SSR middleware, routing
    ssr/           renderReactStream.tsx (streaming SSR with renderToPipeableStream)
    middleware/    reactMiddleware, errorMiddleware, routing
  shared/          Models and types shared between client and server
tests/             Jest test suites (client/, server/, shared/)
scripts/           Utility scripts (image conversion)
dist/              Compiled output (not checked in)
  dist/app.js      Server entry point
  dist/public/     Static client assets
```

## Code Style

- TypeScript everywhere — no plain `.js` in `src/`
- React functional components with hooks (no class components)
- Redux Toolkit for state management (`createSlice`, `configureStore`)
- Font Awesome icons imported individually (tree-shaking), never the full library
- SCSS with Bootstrap 5 partial imports — not the full Bootstrap CSS
- Use `__PRODUCTION__` and `__SERVER__` globals (injected by Webpack DefinePlugin) for environment checks

## Webpack Build Globals

These boolean constants are injected at build time and available in all source files:

- `__PRODUCTION__` — `true` in production builds, `false` in dev
- `__SERVER__` — `true` in the server bundle, `false` in the client bundle

They are declared in `src/shared/types.d.ts` and mocked in `jest.config.ts`.

## Testing

```bash
npm run test:client
```

- Tests live in `tests/` with `.spec.ts` or `.spec.tsx` extensions
- Jest config is in `jest.config.ts` — preset is `ts-jest`, environment is `node`
- Module aliases (`client/`, `server/`, `shared/`) are mapped in Jest config
- Image/font imports are stubbed to an empty string fixture

## Critical CSS ⚠️

`src/client/index.html` contains an inline `<style>` block (~700 lines) of **hand-maintained critical CSS**. This duplicate of above-the-fold styles ships inline so the page renders correctly before the async stylesheet loads.

**When you change styles that affect above-the-fold elements, you MUST update BOTH:**

1. `src/client/styles/styles.scss` (or the relevant `.scss` partial) — source of truth
2. `src/client/index.html` `<style>` block — the critical CSS subset

If only the SCSS file is updated, users will see a flash of old styles (FOUC/CLS).

## Git Workflow

- **Main branch:** `main` (pushes trigger CI/CD deploy to Azure)
- Commit messages: concise, imperative mood
- Run `npm run test:client` and `npm run lint` before pushing

## Boundaries

### ✅ Always
- Run all commands from the repository root
- Use `package.json` scripts (`npm run …`) — never invoke tools directly
- Use `npm run start:server` for local development
- Run tests before committing (`npm run test:client`)
- Keep critical CSS in `index.html` in sync with SCSS changes
- Use the existing Font Awesome tree-shaken import pattern
- Use TypeScript — no untyped JavaScript in `src/`

### ⚠️ Ask First
- Adding new npm dependencies
- Modifying `webpack.config.ts`
- Changing the Express middleware pipeline order
- Modifying the CI/CD workflow (`.github/workflows/main_bharney.yml`)

### 🚫 Never
- Commit secrets, API keys, or credentials
- Import the full Font Awesome library
- Import the full Bootstrap CSS (use partial SCSS imports)
- Delete or modify `dist/` contents directly — they are build output
- Modify `node_modules/`
