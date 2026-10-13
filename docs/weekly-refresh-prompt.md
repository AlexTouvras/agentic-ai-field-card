# Weekly field card — Cursor Automation

Each Friday the automation **judges whether the public card should change**, applies updates when earned, and leaves the weekly PR open. A separate **review** agent publishes or keeps the previous card. Do not assume CI left ready-to-merge HTML on main.

Discovery alone is not enough. Every run must end with an explicit **update** or **no HTML change** decision.

## Slack

Do **not** post Approve links from this run. The review agent is the gate. If that agent misses, Monday watchdog posts a FYI in #orbit — finish by re-running the 18:00 review (or `Apply review`), not Slack Approve.

## Scope (keep this card honest)

This is a decision guide, not a capability glossary and not a framework menu. Analytics owns “stack”. The picture is the job. The stable spine is:

- H1: `Don't start with an agent.` Hook: `Start with the job. Add autonomy only when the problem demands it.`
- The opening picture is one business problem branching to a simple workflow, a RAG assistant, or an agent.
- Section 1 offers four patterns: RAG, workflow, agent, tools / MCP. Selecting one states why it fits and when to move up.
- Section 2 is the loop this card owns. The sentence `Agentic AI is a loop, not a menu` stays on that section. The steps are request → observe → decide → act → verify → approval → success, with a retry. Do not redraw it as an open rail.
- A2A stays one boundary sentence under the architecture row. It is not a seventh tile.
- Prompted chat is one sentence under the headline. It is the floor, not a station.
- Build safely keeps security, permissions, budgets, traceability, evaluation, and the human gate.
- Prove it names the six bars (task success, factual accuracy, escalation, latency, cost per task, failure recovery) and does not print invented rates or a fictional outcome.
- Named-practice links stay on the architecture row. Do not put a problem/use/example table, a framework picker, or a ladder back in front of the picture.
- The storytelling robot module inlined at the bottom of `index.html` (same source as `robot.js`). Orbit publishes only `index.html` to `/field-card/`, so the module has to live in that file. It is chrome, loaded live from `AlexTouvras/storytelling`. Do not remove it, do not vendor `robot.riv`, and do not mount a second robot as the illustration.

Do not add capability icon walls, ACP as a hero protocol, or an evolution-as-progress timeline. Grain stays on Analytics. Calendars, proof, and cutover stay on Technology Delivery.

## Steps

1. Check out `AlexTouvras/agentic-ai-field-card`. Prefer open branch `chore/weekly-refresh-YYYY-Www` for this ISO week; otherwise create/update it from `main`.
2. Run `npm run discover` (GitHub access via `gh` in the Cloud Agent). Read `data/discovery-report.md` and the current `index.html`.
3. **Decide (required):**
   - **Update card** if a branch teaches the wrong move, the loop can no longer stop or retry, the human gate disappears, A2A is no longer a boundary, a named-practice URL is dead, or Prove it prints an invented rate.
   - **No HTML change** if candidates are noise, a renamed framework, or a new vendor row. Restoring the problem/use/example table, the framework picker, or the ladder is not an update.
   - Write the decision in the PR `## Summary` either way. Never skip this step.
4. If updating `index.html`:
   - Do not invent docs URLs; use discovery report, watchlist, or existing card links.
   - A new protocol earns a station only when it solves a new job (knowledge / control / tools / peers). Behavior stays in rules and skills, under judgement.
   - Do not change the public H1.
   - No editor notes on the public HTML.
   - Update the footer **Changed** line so it says what the picture now says. Bump version with `npm run bump:version` when the card content changed.
   - Footer **Next** is the following calendar month (`November 2026`), never `week of`. `bump:version` writes that shape.
5. If **no HTML change**: leave the picture, Reviewed, and Next alone. Do not open a stamp-only bump. A no-change week does not move the monthly footer. Changed line when the picture’s HTML did not change: `Monthly review — the decision guide unchanged`. Still commit discovery artifacts if you re-ran discover on this branch.
6. Run `node scripts/check-links.mjs` and fix failures on any URLs you touched.
7. Update `data/watchlist.json` for tools you confirm for ongoing tracking (`onCard` true/false).
8. Commit and push to the weekly PR. Do not merge. Do not force-push `main`.
9. Rewrite the PR body to include at least:
   - `## Summary` — 3–6 bullets: what changed on the card **or** why nothing changed; what was deferred.
   - `## Card preview` — one line: the review agent will compare this HTML to live.
10. Stop. Do not notify Slack. Do not merge. The Friday 18:00 review agent publishes a card change, or leaves the previous card when nothing changed. It declines only when the PR would make the live card worse.

## Done when

- Discovery ran this session
- Explicit update **or** no-change decision is in `## Summary`
- Link check exits 0 (if HTML or links changed)
- PR left open for the review agent
