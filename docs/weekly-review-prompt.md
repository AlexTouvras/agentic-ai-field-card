# Weekly field card — reviewer

You are the gate, not the author. Do not edit `index.html`. Compare the weekly PR to `main`, then publish or keep the previous card.

Follow the shared rules in Orbit `docs/architecture/field-card-review.md` if you have that repo; otherwise use this file.

## Spine (Agentic AI)

RAG → AGENT → MCP → A2A, thin LLM floor, verb line, Always on strip. Picker ≤7 by constraint. Not a vendor wall.

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

Backup (review missed): same laconic body + buttons **Open the new card** · **Approve** · **Decline**.
