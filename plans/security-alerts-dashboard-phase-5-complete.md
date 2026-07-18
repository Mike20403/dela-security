# Phase 5 Complete: Domain and MSW Data Foundation

Replaced manual in-memory API mocking with MSW at the network boundary. Alerts now flow through a native fetch repository, strict Yup response validation, shared browser/test request handlers, and centralized React Query keys while retaining 32 realistic security records.

## Files created/changed

- `package.json`
- `yarn.lock`
- `public/mockServiceWorker.js`
- `src/main.tsx`
- `src/test/setup.ts`
- `src/test/msw-server.ts`
- `src/core/types/alerts.ts`
- `src/core/errors/AppError.ts`
- `src/pages/alerts/api/alerts-repository.ts`
- `src/pages/alerts/api/api-paths.ts`
- `src/pages/alerts/api/alert-schema.ts`
- `src/pages/alerts/api/alert-schema.test.ts`
- `src/pages/alerts/api/fetch-alerts-repository.ts`
- `src/pages/alerts/api/fetch-alerts-repository.test.ts`
- `src/pages/alerts/api/mock-alerts.ts`
- `src/pages/alerts/api/mock-alerts.test.ts`
- `src/pages/alerts/api/alert-query-keys.ts`
- `src/pages/alerts/api/alert-query-keys.test.ts`
- `src/pages/alerts/api/mock/browser.ts`
- `src/pages/alerts/api/mock/handlers.ts`
- `src/pages/alerts/api/mock/handlers.test.ts`
- `src/pages/alerts/hooks/useAlerts.ts`
- `src/pages/alerts/hooks/useAlerts.test.tsx`
- `plans/security-alerts-dashboard-plan.md`

## Functions created/changed

- `createAlertsHandlers`
- `resetDefaultAlertsHandlers`
- `fetchAlertsRepository.list`
- `fetchAlertsRepository.update`
- `alertSchema`
- `alertListSchema`
- `alertKeys`
- `alertListOptions`
- `useAlerts`
- Development-only `enableMocking`

## Tests created/changed

- Dataset completeness, uniqueness, and domain coverage
- Strict list and update response validation
- Native fetch failure and HTTP error mapping
- Malformed JSON payload and non-JSON error handling
- Stateful GET and PATCH behavior
- Unknown alert and invalid update responses
- Configurable 600–900 ms delay behavior
- First-request-only failure and deterministic reset
- Query-key stability and hook behavior

## Review Status

APPROVED

## Git Commit Message

feat: add MSW alerts data layer

- serve realistic alerts through shared MSW handlers
- validate fetch responses with strict Yup schemas
- add tested query keys and alert repository hooks
