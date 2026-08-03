# Durability

How this card stays honest for years — not just this week’s PR.

## Weekly loop (already automated)

| Stage | Owner | Failure mode if silent |
|-------|--------|-------------------------|
| Friday discovery + link check | GitHub Actions | No candidates / broken URLs unnoticed |
| Friday judgment + HTML | Cursor Automation | Discovery PR never earns a `Decision:` |
| Slack Approve / Skip | Human in #orbit | PRs pile up; Pages drifts |

Saturday **Judgment health check** opens a `field-card-judgment` issue when a `chore/weekly-refresh-*` PR is still open without `Decision: update` or `Decision: no-change` after ~20h.

## Quarterly ontology review (human, ~30 min)

Do this once a quarter even if weekly merges look fine. Automation swaps **rows**; it does not invent a new **map**.

1. **Layers still jobs?** knowledge / control / tools / peers / behavior — any new *job* that needs a layer, or a dead layer to fold?
2. **Picker constraints** — control, speed, data, enterprise, handoffs, typed, google, anthropic… Missing a real niche? Redundant?
3. **Watchlist** — add repos you keep hearing about; move dead ones to `ignoreRepos`; refresh `searchQueries` and `noisePatterns` in `data/watchlist.json`.
4. **Doc links** — spot-check Use-column destinations in README / card; prefer canonical vendor docs over blogs.
5. **Automation still scheduled?** Confirm Friday Cursor Automation + secrets (`SLACK_*`, signing secret, Orbit token) still work.
6. **Log the pass** — one line in git history or a short note under Key decisions in `.state/ARCHITECTURE.md`.

## What not to automate further

- Auto-merge without Slack Approve
- Adding a fifth–nth layer because a product launched
- Ranking the card by GitHub stars alone

## Scripts

```bash
npm run discover          # landscape + scored novel hits
npm run check:links       # public href health
npm run check:judgment    # local run of Saturday SLA (needs gh auth)
```
