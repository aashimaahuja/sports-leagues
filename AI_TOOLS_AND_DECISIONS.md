# AI Tools & Design Decisions

## AI Tools Used

### 1. V0 by Vercel: UI Prototyping
Used V0 to rapidly generate a visual prototype of the sports leagues UI.

### 2. Claude (Anthropic): Vue Application Scaffolding
Claude was used to bootstrap the initial project setup.

### 3. Cursor (Plan Mode): E2E Test Planning
Cursor's Plan Mode was used to create all E2E test scenarios before writing any test code.

### 4. Claude (Anthropic): Playwright Test Setup
Claude assisted with configuring Playwright for both component tests (`playwright-ct.config.ts`) and E2E tests (`playwright.config.ts`), and helped write the actual test specs across `leagues-list.e2e.spec.ts`, `league-detail.e2e.spec.ts`, and `navigation.e2e.spec.ts`.

---

## Key Design Decisions

### Component Architecture
Components are split by domain (`leagues/`, `league-detail/`, `shared/`).

### State Management
Pinia was chosen for its lightweight API and TypeScript support. The `useLeaguesStore` store centralises all league data fetching and filtering logic.

### Testing Strategy
A three-tier testing approach was used:
- **Unit tests** (using vitest)for all .ts files which are not UI component
- **Component tests** (Playwright CT) for unit tests of individual UI components
- **E2E tests** (Playwright) for e2e testing

### Routing
Vue Router with named routes (`routeNames.ts`).

### Responsiveness
Tailwind's mobile-first utility classes are used throughout.

### Caching in the store
The store acts as an in-memory cache: leagues are fetched once and reused on repeat visits, and season badges are stored in a keyed object (`seasonBadgeCache`) so each league's badge API call is made at most once per session.

### TypeScript
TypeScript is enabled across the whole project.
All API shapes are captured in dedicated `types/` files.