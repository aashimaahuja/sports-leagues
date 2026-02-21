# AI Tools & Design Decisions

## AI Tools Used

### 1. V0 by Vercel — UI Prototyping
**Purpose:** Quick design prototype  
Used V0 to rapidly generate a visual prototype of the sports leagues UI. This allowed fast iteration on layout and component structure (league list, detail view, filters) before writing any code, serving as a design reference for the final implementation.

### 2. Claude (Anthropic) — Vue Application Scaffolding
**Purpose:** Scaffolding the Vue 3 application  
Claude was used to bootstrap the project structure, including setting up Vue 3 with TypeScript, Vite, Vue Router, and Pinia providing a basic foundation to build on.

### 3. Cursor (Plan Mode) — E2E Test Planning
**Purpose:** Planning end-to-end tests  
Cursor's Plan Mode was used to reason through meaningful E2E test scenarios before writing any test code. This helped identify the key user flows to cover:
- Leagues list rendering and search/filter interactions
- Navigation between list and detail views
- League detail page content validation

### 4. Claude (Anthropic) — Playwright Test Setup
**Purpose:** Playwright test configuration and authoring  
Claude assisted with configuring Playwright for both component tests (`playwright-ct.config.ts`) and E2E tests (`playwright.config.ts`), and helped write the actual test specs across `leagues-list.e2e.spec.ts`, `league-detail.e2e.spec.ts`, and `navigation.e2e.spec.ts`.

---

## Key Design Decisions

### Component Architecture
Components are split by domain (`leagues/`, `league-detail/`, `shared/`) rather than by type. This keeps related logic co-located and makes it easy to find tests alongside their components (`.ct.spec.ts` files sit next to the `.vue` files they test).

### State Management
Pinia was chosen for its lightweight API and first-class TypeScript support. The `useLeaguesStore` store centralises all league data fetching and filtering logic, keeping views thin and free of business logic.

### Testing Strategy
A three-tier testing approach was used:
- **Unit tests** using vitest
for all .ts files which are not UI component
- **Component tests** (Playwright CT) for isolated unit-level rendering and interaction of individual components
- **E2E tests** (Playwright) for full user journey validation against the running app

### Routing
Vue Router with named routes (`routeNames.ts`) keeps route references type-safe and refactor-friendly, avoiding hard-coded path strings scattered across the codebase.

