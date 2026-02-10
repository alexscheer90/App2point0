# NCAA Data Migration Plan

This document outlines a practical, step-by-step path to replace ESPN data with NCAA data for live scoring, standings, and stats.

## 1) Identify and inventory your current ESPN usage

**Goal:** Know every place ESPN data is currently used so we can replace it without breaking UI behavior.

- Search for ESPN-specific services and endpoints.
- Capture all output shapes (e.g., game, team, standings, stats) used by the UI.

**Suggested actions**
- Inventory the public methods exposed by `client/src/services/espnScoreboardService.ts`.
- Capture the internal `Game`/`Team`/`Standing` model shapes expected by UI components.

## 2) Decide the NCAA data access strategy

**Recommended:** Proxy NCAA requests through your server to avoid CORS, centralize caching, and reduce legal risk.

### Option A: Server-side proxy (recommended)
- Create a server service (e.g. `server/services/ncaaService.ts`).
- This service calls NCAA endpoints and normalizes data into your internal models.

### Option B: Client-only calls (not recommended)
- Avoided due to CORS limitations and less control over throttling/caching.

## 3) Implement a new NCAA service layer

**Goal:** Provide a drop-in replacement for ESPN service calls.

### Suggested module structure
- `server/services/ncaaService.ts`
  - `fetchScoreboard(sportId: string, date: string)`
  - `fetchStandings(sportId: string, season: string)`
  - `fetchTeamStats(sportId: string, teamId: string)`

### Suggested client wrapper
- `client/src/services/ncaaScoreboardService.ts`
  - Mirrors the method signatures used by the UI today.
  - Maps NCAA data into the same internal models (e.g., `Game`).

## 4) Map NCAA responses into your existing models

**Goal:** Preserve current UI expectations.

- Create transformation functions that map NCAA responses into your internal types.
- Keep the `Game` structure stable so UI components require minimal to no changes.

## 5) Swap ESPN calls to NCAA calls

**Goal:** Replace ESPN usage in a controlled, reversible way.

- Introduce a config flag to toggle ESPN vs NCAA in development.
- Update UI service imports to use NCAA wrapper first.

## 6) Enforce MAC-only games per sport (including affiliates)

**Goal:** Ensure scoreboards only include MAC schools, while allowing affiliate members for the sports they participate in.

- Maintain an explicit mapping of affiliate schools by sport.
- Filter games to include only matchups where at least one team is a MAC member for that sport.


## 7) Validate and harden

**Goal:** Ensure data accuracy and stability.

- Add caching (e.g., in-memory or Redis).
- Add retries and safe fallbacks for missing fields.
- Log raw NCAA responses during early rollout to validate mapping.

## 8) Decommission ESPN

**Goal:** Remove ESPN calls once NCAA is stable.

- Remove ESPN-specific services.
- Remove ESPN-only mappings.
- Update any docs referencing ESPN as primary data.

## Rollout checklist

- [ ] Inventory ESPN usage (services + UI references)
- [ ] Identify NCAA endpoints for scoreboard, standings, stats
- [ ] Create server-side NCAA proxy service
- [ ] Map NCAA responses into internal models
- [ ] Replace ESPN references behind a feature flag
- [ ] Confirm affiliate membership mapping per sport
- [ ] Validate with real data
- [ ] Remove ESPN once stable

## Rollback strategy

If NCAA data is unstable, use the config flag to revert back to ESPN immediately. Keep the data-provider switch in place until NCAA is validated across all sports and seasons.

## Notes on legal risk reduction

- Server-side proxying provides more control over request frequency and caching.
- Avoid scraping HTML; rely on JSON endpoints.
- Avoid embedding NCAA endpoints directly in the client.
