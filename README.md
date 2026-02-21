# Sports Leagues

A Vue 3 app for browsing sports leagues and their season badges, built with Vite, Pinia, and Tailwind CSS.

## Requirements

- **Node.js 22 or later** the project targets Node 22 LTS. If you use nvm, run `nvm install 22 && nvm use 22`.

## Getting started

Install dependencies:

```bash
npm install
```

Then install the Playwright browsers needed for component and e2e tests:

```bash
npx playwright install chromium
```

## Scripts

### Development

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173` with hot module replacement.

```bash
npm run build
```

Runs TypeScript type checking (`vue-tsc`) and then builds the app for production. Output goes to `dist/`.

```bash
npm run preview
```

Serves the production build locally so you can verify it before deploying.

### Code formatting

```bash
npm run format
```

Runs Prettier over all `.ts` and `.vue` files under `src/`. The config lives in `.prettierrc`.

### Testing

There are three separate test suites, each with its own runner and scope.

#### Unit tests (Vitest)

```bash
npm test
```

Runs all `*.test.ts` files once and exits. Good for CI or a quick sanity check.

```bash
npm run test:watch
```

Runs Vitest in interactive watch mode  re-runs affected tests on every file save. Use this while writing or debugging unit tests.

#### Component tests (Playwright CT)

```bash
npm run test:ct
```

Mounts individual Vue components in a real browser (Chromium) using `@playwright/experimental-ct-vue`. Test files follow the `*.ct.spec.ts` naming pattern and live alongside the components in `src/`. No running dev server is needed  Playwright CT spins up its own environment on port 3100.

#### End-to-end tests (Playwright)

```bash
npm run test:e2e
```

Runs full browser tests against the app using the `*.e2e.spec.ts` files in the `e2e/` folder. Playwright automatically starts the dev server on `http://localhost:5173` before the suite runs and shuts it down afterwards, so you don't need to start it manually. If a dev server is already running on that port, it will be reused.

