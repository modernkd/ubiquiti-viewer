## Ubiquiti Viewer — Copilot / AI agent instructions

This small guide contains concrete, repo-specific facts to help an AI coding agent be productive immediately.

Keep this short and actionable. Reference these files when making edits:

- src/App.tsx — app routing, top-level state (viewMode, search, productLineFilter) and how device detail routes are resolved
- src/main.tsx — QueryClientProvider and BrowserRouter are initialized here; QueryClient is single global instance
- src/config/api.ts — API endpoint and cache duration (API_CONFIG.BASE_URL, CACHE_DURATION)
- src/services/deviceService.ts — singleton service implementing manual caching (deviceService.getInstance(), fetchDevices(), clearCache())
- src/hooks/useDevices.ts — primary data fetching hook; uses React Query (queryKey: ["devices"]) and sets staleTime to API_CONFIG.CACHE_DURATION
- src/hooks/useDeviceSearch.ts and src/utils/deviceFilters.ts — search/filter patterns; useMemo-based hook wrapping a pure filter util
- src/components/ — UI components grouped by responsibility (devicedetails/, devicegrid/, devicelist/)
- vite.config.ts — CSS Modules localsConvention: "camelCase" (imports of `*.module.css` expect camelCase class names)
- package.json — dev scripts: `npm run dev` (vite), `npm run build` (tsc -b && vite build), `npm run preview`, `npm run lint`

Quick architecture summary

- Data flow: useDevices (React Query) -> fetches API_CONFIG.BASE_URL -> returns Device[] to components via hook. There is also a DeviceService singleton (src/services/deviceService.ts) that provides manual caching and can be used for imperative fetch flows.
- UI structure: App manages viewMode/search/filter. DeviceToolbar updates global filters. DeviceView delegates to DeviceGrid or DeviceList. Device detail views live under components/devicedetails and are rendered by App route `/device/:id`.
- State & caching: react-query handles most caching; staleTime is set from API_CONFIG.CACHE_DURATION. DeviceService implements an additional in-memory cache and helper methods (clearCache/getCachedDevices).

Project-specific conventions and patterns to follow

- CSS Modules: use `*.module.css` and reference class names in camelCase (vite config enforces localsConvention). Prefer scoping styles to component-level modules.
- Data fetching: prefer `useDevices` (React Query) for declarative components. If you need imperative access or manual cache control, use `deviceService` singleton (examples in src/services/deviceService.ts).
- Query keys: the devices list uses `['devices']`. Keep this consistent when invalidating or refetching.
- Error handling: use `getErrorMessage` from `src/utils/errorUtils.ts` (used by hooks and services) so messages are consistent across UI components.
- Types: device-related shapes live in `src/types/device.ts`. Update types here when modifying device properties.

Debugging / build notes (how developers run the project)

- Dev server: `npm run dev` (Vite — default port 5173)
- Build: `npm run build` (runs `tsc -b` then `vite build`). Note: the build pipeline runs TypeScript project references via `tsc -b` first.
- Preview: `npm run preview` to serve the production build locally
- Lint: `npm run lint` runs ESLint; there is no test runner configured in the repo

Examples (concrete snippets and references)

- To read devices in a component (preferred):
  - import { useDevices } from "./hooks/useDevices";
  - const { devices, loading, error, refetch } = useDevices();
  - `refetch()` triggers a manual refresh (React Query refetch)
- For imperative/manual caching operations:
  - import { deviceService } from "./services/deviceService";
  - await deviceService.fetchDevices(); // returns {data, loading, error}
  - deviceService.clearCache(); // force next fetch to refresh

Merge guidance

- If this repo already contains a `.github/copilot-instructions.md` or other agent docs, preserve any specific human-written guidance and merge these facts into it rather than overwriting. Look for references to: `useDevices`, `deviceService`, API_CONFIG, and `['devices']` query key.

Edge cases and gotchas

- The API used is a static JSON from `https://static.ui.com/fingerprint/ui/public.json`. It can change structure — most code checks for `data && data.devices` and throws on unexpected format. When adding fields, prefer defensive checks and update `src/types/device.ts`.
- deviceService includes console.log statements; expect noisy output during development and in unit-level debugging.

If anything here is unclear or you want different phrasing/extra examples (e.g., how to add a new route or a new component with styles), say which area and I will iterate.
