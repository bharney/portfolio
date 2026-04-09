# Portfolio — bharney.com

Personal portfolio, blog, and about-me site for **bharney**. Built with server-side rendered React on an Express backend, bundled with Webpack, and styled with Bootstrap 5 + custom SCSS.

## Tech Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Language | TypeScript                                                       |
| UI       | React 18, React Router 6, Redux Toolkit                          |
| Server   | Express 4 with SSR via `react-dom/server`                        |
| Styling  | Bootstrap 5 (custom partial import), SCSS, PostCSS with PurgeCSS |
| Bundling | Webpack 5 (separate client & server configs)                     |
| Testing  | Jest, SuperTest                                                  |
| Icons    | Font Awesome 6 (tree-shaken individual imports)                  |
| CI/CD    | GitHub Actions → Azure Web App                                   |

## Project Structure

```
src/
  client/       # React app, components, Redux store, styles, images
  server/       # Express server, SSR middleware, routing
  shared/       # Models and types shared between client and server
tests/          # Jest test suites (client, server, shared)
scripts/        # Utility scripts (e.g. image conversion to WebP)
dist/           # Compiled output (not checked in)
```

## Prerequisites

- **Node.js** 20.x (matches the CI pipeline)
- **npm** (ships with Node)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack dev server (recommended for local development)
npm run start:server
```

### `start:server` — Full-Stack Development

`npm run start:server` is the primary command for local development. Under the hood it runs two processes in parallel via `concurrently`:

1. **Webpack in watch mode** — continuously recompiles both the client bundle and the server bundle whenever source files change. Output lands in `./dist`.
2. **Nodemon** — watches `./dist/app.js` and automatically restarts the Express server each time Webpack finishes a server rebuild.

Once both processes are up, the site is available at **http://localhost:9000**. Changes to any file under `src/` will trigger a rebuild and a server restart automatically.

> **Tip:** Because the server performs React SSR, you get a fully rendered page on first load — the same experience production users see.

### Other Scripts

| Command                | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run start:client` | Webpack Dev Server with Hot Module Replacement (client only, no SSR) |
| `npm run build`        | Production build (optimised, minified)                               |
| `npm run test:client`  | Run Jest test suites                                                 |
| `npm run lint`         | ESLint across all `.ts` files                                        |
| `npm run prettier`     | Auto-format source files                                             |
| `npm run images:webp`  | Convert images in `src/client/images/` to WebP via Sharp             |
| `npm run analyze`      | Production build + Webpack Bundle Analyzer                           |

## Compilation Output

After a build, all output is in the `./dist` folder:

- `./dist/app.js` — Express server entry point
- `./dist/public/` — Static client assets (JS, CSS, images, fonts)

## Critical CSS

The file `src/client/index.html` contains a large inline `<style>` block (~700 lines) of **critical CSS**. This is hand-maintained CSS that the browser needs _before_ the async stylesheet finishes loading. It covers above-the-fold content: the navbar, Bootstrap grid/utilities, hero/parallax section, sidebar skeleton, FontAwesome icon sizing, and font-face fallbacks.

**Why it exists:** The full stylesheet is loaded asynchronously to avoid render-blocking. Without this inline critical CSS the page would show unstyled content (FOUC) or shift layout (CLS) while the stylesheet downloads.

**⚠️ When you change styles that affect above-the-fold elements, you must update _both_ files:**

1. `src/client/styles/styles.scss` (or the relevant `.scss` partial) — the source of truth for all styles.
2. `src/client/index.html` `<style>` block — the duplicated critical subset that ships inline in the HTML.

If you only update the SCSS file, the async stylesheet will eventually apply the change, but users will see a flash of the _old_ critical CSS first, causing visible layout shift. Keep both files in sync for any property that touches the nav, body, grid layout, hero section, or other above-the-fold content.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/main_bharney.yml`) which builds the app and deploys it to an Azure Web App.
