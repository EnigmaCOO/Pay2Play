---
name: fix-screenbackground-import
overview: Fix the static rendering error in the Expo player app by correcting how the shared `ScreenBackground` component is imported and ensuring consistency with existing shared UI imports.
todos:
  - id: update-matches-import
    content: Update `apps/player-app/app/(tabs)/matches.tsx` to import `ScreenBackground` from `@shared/ui/ScreenBackground` instead of a relative `../../shared/...` path.
    status: completed
  - id: check-other-tabs-imports
    content: Scan other tab screens under `apps/player-app/app/(tabs)/` and standardize any `../../shared/...` imports to use the `@shared` alias.
    status: completed
    dependencies:
      - update-matches-import
  - id: verify-dev-build
    content: Reload the Expo dev build, open the Matches tab, and confirm the static rendering error is gone and the screen renders correctly.
    status: completed
    dependencies:
      - check-other-tabs-imports
---

## Fix ScreenBackground import for matches tab

### Context

- The error comes from `apps/player-app/app/(tabs)/matches.tsx` importing `ScreenBackground` via `../../shared/ui/ScreenBackground`, which Metro cannot resolve.
- The shared UI components live under `[repo root]/shared/ui`, and other player-app screens already import them using the `@shared` alias (e.g., `import ScreenBackground from '@shared/ui/ScreenBackground';`).
- The player app `tsconfig.json` already defines a `@shared/*` path pointing to `../../shared/*`, so the intended pattern is to use the alias rather than fragile relative paths.

### Plan

1. **Align matches screen import with existing shared alias**

- Open `[apps/player-app/app/(tabs)/matches.tsx](apps/player-app/app/\\(tabs)/matches.tsx)`.
- Replace the line:
- `import ScreenBackground from '../../shared/ui/ScreenBackground';`
- With the alias-based import used elsewhere in the app:
- `import ScreenBackground from '@shared/ui/ScreenBackground';`
- Ensure no other relative `../../shared/...` imports exist in this file.

2. **Verify other shared UI imports for consistency**

- Quickly scan other files under `apps/player-app/app/(tabs)/` to confirm they either:
- Use `@shared/...` for components under `shared/`, or
- Use local relative imports for components within `apps/player-app`.
- If any other tab screens use `../../shared/...`, update them to `@shared/...` to avoid similar Metro resolution issues.

3. **Run the player app and confirm the error is resolved**

- With `yarn players dev` (or your existing dev command) running, trigger a rebuild (e.g., `r` in the Metro terminal or reload in the browser).
- Navigate to the **Matches** tab in the player app.
- Confirm:
- The static rendering error no longer appears in the console.
- The `Matches` screen renders correctly within the `ScreenBackground` layout.

4. **Optional: document the shared import convention**

- Add a short note in an existing dev doc (e.g., [`DEVELOPMENT.md`](DEVELOPMENT.md) or `SCREENS_IMPLEMENTATION_PLAN.md` in the player app) stating that shared components under `shared/` should always be imported using the `@shared` alias.
- This helps prevent future regressions with incorrect relative paths, especially in new screens.