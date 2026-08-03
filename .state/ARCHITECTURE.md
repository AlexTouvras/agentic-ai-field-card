# Architecture (working log)

> Tracked in git. Living decisions for this repo — not a substitute for `docs/architecture/`.

## Overview

Standalone one-pager (`index.html`) for agentic AI delivery choices. Weekly CI discovers landscape + checks links; Cursor Automation judges HTML edits; Slack Approve merges. Public artifact only — maintenance notes in `docs/`.

## Data shapes

| Name | Shape / location | Notes |
|------|------------------|-------|
| Watchlist | `data/watchlist.json` | frameworks, protocols, searchQueries, noisePatterns, ignoreRepos |
| Discovery report | `data/discovery-report.{json,md}` | candidates scored; rejectedNoise logged |
| Link report | `data/link-report.json` | href HEAD/GET results |
| Proposed updates | `data/proposed-updates.json` | judgment changelog stub |

## Design patterns

- Stable ontology (layers/jobs) vs churn zone (picker ≤7, product nouns, doc URLs)
- CI without vendor LLM; judgment in Cursor Automation
- Machine-readable `Decision: update|no-change` for Saturday SLA

## Dependencies

| Dependency | Why introduced | Date |
|------------|----------------|------|
| GitHub Actions + `gh` | discovery PR, issues, Slack notify | 2026-07 |
| Orbit Slack webhook / signing secrets | Approve/Skip + card preview | 2026-07 |
| Cursor Cloud Automation | HTML judgment | 2026-07 |

## File structure

```text
agentic-ai-field-card/
├── index.html
├── data/           # watchlist + generated reports
├── docs/           # weekly prompt, durability
├── scripts/        # discover, links, judgment, slack, bump
└── .github/workflows/
```

## Key decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-30 | No vendor LLM in CI | Keep discovery cheap/stable; judgment elsewhere |
| 2026-08-03 | Score + noise-filter novel search hits | Star magnets were drowning real framework candidates |
| 2026-08-03 | Saturday judgment health check | Detection when Automation/human gate goes silent |
