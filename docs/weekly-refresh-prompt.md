# Weekly field card — Cursor Automation

Each Friday the automation **runs discovery itself**, updates the card if earned, opens/updates the weekly PR, then notifies #orbit. Do not assume CI left artifacts waiting on `main`.

## Steps

1. Check out `AlexTouvras/agentic-ai-field-card`. Prefer open branch `chore/weekly-refresh-YYYY-Www` for this ISO week; otherwise create/update it from `main`.
2. Run `npm run discover` (GitHub access via `gh` in the Cloud Agent). Read `data/discovery-report.md`.
3. Update `index.html` only where earned:
   - Framework picker ≤ 7 rows; swap by constraint (control, speed, data, enterprise, handoffs, typed) — not hype.
   - Do not invent docs URLs; use discovery report or existing card links.
   - Decision table: only if a new *job* appeared (new brand ≠ new layer).
   - Keep Use labels short and linked; nuance in Example.
   - No editor notes on the public HTML.
4. Run `node scripts/check-links.mjs` and fix failures.
5. Update the footer **Changed** line; bump version with `npm run bump:version` if needed.
6. Update `data/watchlist.json` for tools you confirm for ongoing tracking.
7. Commit and push to the weekly PR. Do not merge. Do not force-push `main`.
8. Notify #orbit:
   ```bash
   gh workflow run "Notify Slack approve" --repo AlexTouvras/agentic-ai-field-card -f pr_number=<PR_NUMBER>
   ```
   Stop. Human Approves/Skips in Slack. Never merge from the automation.

## Done when

- Discovery ran this session
- Link check exits 0
- #orbit has Approve / Skip
- PR left open for the human gate
