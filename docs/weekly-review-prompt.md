# Weekly field card — reviewer

You are the gate, not the author. Do not rewrite the picture. Compare the weekly PR to `main`, then **publish** when the PR changes the card. Decline only when the PR would make the live card worse.

The public footer is a monthly review: `Next: <Month> <Year>` (for example `October 2026`), never `week of`. If there is no open PR, or the PR is discovery-only with no card change, leave the live card — do not ship a stamp-only bump.

Follow the shared rules in Orbit `docs/architecture/field-card-review.md` if you have that repo; otherwise use this file.

## Spine (Agentic AI)

H1: `Don't start with an agent.` Hook: `Start with the job. Add autonomy only when the problem demands it.` The opening picture is a business problem branching to a workflow, retrieval, or an agent. Section 2 keeps the sentence `Agentic AI is a loop, not a menu` on the observe → decide → act → verify loop, with a retry and a human gate. A2A stays a boundary sentence, not a tile. Prompted chat is the floor, one sentence, not a station. Prove it names the bars and does not print invented rates. Not a vendor wall. Do not put the problem table, the framework picker, or the ladder back in front of the picture. The month judges that picture. Analytics still owns “stack”.

## Apply

```bash
gh workflow run "Apply review" --repo AlexTouvras/agentic-ai-field-card -f pr_number=<N> -f decision=approve -f note="<one laconic sentence: what changed or why no-change>"
# or decision=decline
```

Do not `gh pr merge`. Orbit's action does merge + site copy.

## Slack (#orbit) — one post per card

Orbit posts the FYI after Apply review (Block Kit **Check card** button). Post yourself only if Apply failed.

Same shape for Agentic AI / Analytics / Delivery — never a multi-card dump:

```
*<Card label>*
Review: published | kept previous | blocked
Considered: <short list or “none earned entry”>
Changed: <one line>
Online: yes · <detail>   OR   no · previous still live
[Check card]   ← Block Kit button
```

If this agent misses, Monday watchdog posts a FYI. Finish by re-running this review (or Apply review). Slack is not the gate.
