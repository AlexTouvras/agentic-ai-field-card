# Weekly field card — Cursor Automation

Each Friday the automation **judges whether the public card should change**, applies updates when earned, opens/updates the weekly PR, then notifies #orbit with a **card preview** + Approve/Skip. Do not assume CI left ready-to-merge HTML on main.

Discovery alone is not enough. Every run must end with an explicit **update** or **no HTML change** decision.

## Steps

1. Check out `AlexTouvras/agentic-ai-field-card`. Prefer open branch `chore/weekly-refresh-YYYY-Www` for this ISO week; otherwise create/update it from `main`.
2. Run `npm run discover` (GitHub access via `gh` in the Cloud Agent). Read `data/discovery-report.md` and the current `index.html`.
3. **Decide (required):**
   - **Update card** if a picker swap, docs URL fix, or new *job* in the decision table is earned.
   - **No HTML change** if candidates are noise, picker is full with better incumbents, or nothing new belongs on a one-pager.
   - Write the decision in the PR `## Summary` either way. Never skip this step.
4. If updating `index.html`:
   - Framework picker ≤ 7 rows; swap by constraint (control, speed, data, enterprise, handoffs, typed, google, …) — not hype or star count alone.
   - Do not invent docs URLs; use discovery report, watchlist, or existing card links.
   - Decision table: only if a new *job* appeared (new brand ≠ new layer).
   - Keep Use labels short and linked; nuance in Example.
   - No editor notes on the public HTML.
   - Update the footer **Changed** line; bump version with `npm run bump:version` when the card content changed.
5. If **no HTML change**: leave `index.html` alone (aside from any stamp CI already bumped). Still commit discovery artifacts if you re-ran discover on this branch.
6. Run `node scripts/check-links.mjs` and fix failures on any URLs you touched.
7. Update `data/watchlist.json` for tools you confirm for ongoing tracking (`onCard` true/false).
8. Commit and push to the weekly PR. Do not merge. Do not force-push `main`.
9. Rewrite the PR body to include at least:
   - `## Summary` — 3–6 bullets: what changed on the card **or** why nothing changed; what was deferred.
   - `## Card preview` — one line: Slack will open the proposed `index.html` via Orbit before Approve.
10. Notify #orbit **only after** the judgment commit + Summary exist:
    ```bash
    gh workflow run "Notify Slack approve" --repo AlexTouvras/agentic-ai-field-card -f pr_number=<PR_NUMBER>
    ```
    Stop. Human reviews the **Open card preview** link, then Approves/Skips in Slack. Never merge from the automation.

## Done when

- Discovery ran this session
- Explicit update **or** no-change decision is in `## Summary`
- Link check exits 0 (if HTML or links changed)
- #orbit has preview + Approve / Skip
- PR left open for the human gate
