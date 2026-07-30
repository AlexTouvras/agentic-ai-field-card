# Weekly field card — Cursor Automation

CI already ran discovery (GitHub only — no Anthropic/OpenAI keys). Your job is judgment + HTML edits.

Runs every **Friday after** the GitHub Action discovery PR (Action ~12:00 UTC; this automation ~17:00 local / 14:00 UTC).

## Repo

`AlexTouvras/agentic-ai-field-card` on branch `main`, or the open PR branch `chore/weekly-refresh-YYYY-Www` if one exists for this ISO week.

## Steps

1. Check out the weekly refresh PR branch if open; otherwise create/update `chore/weekly-refresh-YYYY-Www` from `main`.
2. Read `data/discovery-report.md` and `data/proposed-updates.json` (deferred candidates).
3. Update `index.html` only where earned:
   - Framework picker ≤ 7 rows; swap by constraint (control, speed, data, enterprise, handoffs, typed) — not hype.
   - Do not invent docs URLs; use links from the discovery report or existing card links.
   - Decision table: change only if a new *job* appeared (new brand ≠ new layer).
   - Keep Use labels short and linked; nuance in Example.
   - No editor notes on the public HTML.
4. Run `node scripts/check-links.mjs` and fix failures.
5. Set the footer **Changed** line to a few concrete facts; leave version stamp if CI already bumped it this week.
6. If a candidate is confirmed for future tracking, add/update `data/watchlist.json`.
7. Commit and push to the weekly PR branch. Open or update the PR. Do not merge unless explicitly asked. Do not force-push `main`.

## Done when

- Discovery candidates reviewed (accepted, deferred, or rejected with reason in the PR)
- Link check exits 0
- PR body lists what changed on the card
