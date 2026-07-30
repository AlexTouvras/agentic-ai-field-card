# Weekly content refresh (Cursor Automation / agent)

Use this when the scheduled GitHub Action has opened (or you want) a PR,
and you need more than a version bump: frameworks moved, a protocol matured,
or an example went stale.

## Goal

Keep `index.html` accurate without rewriting the card's structure.

## Hard rules

1. **Do not** add editor notes, "stable/churn" badges, or maintenance prose onto the public HTML.
2. **Do not** rewrite the Problem → Use table when a framework is renamed — edit the **Framework picker** only.
3. A new protocol gets a **new stack layer** only if it solves a new job (knowledge / control / tools / peers / behavior). A new brand for an old job is a link or picker swap.
4. Keep **Use** as short linked labels; put nuance in **Example**.
5. Update the footer **Changed** line to a few concrete facts. Bump version only if `scripts/bump-version.mjs` hasn't already this week.
6. After edits, run `node scripts/check-links.mjs` and fix any failures.
7. Open or update a PR against `main`. Do not force-push `main`. Do not merge unless asked.

## Research (web)

Scan for material changes since the footer **Reviewed** date:

- MCP spec / modelcontextprotocol.io
- A2A protocol (a2a-protocol.org)
- LangGraph, CrewAI, LlamaIndex, Microsoft Agent Framework, OpenAI Agents SDK, Claude Agent SDK, Pydantic AI release notes
- Cursor Rules / Skills docs if those Use links 404

## Edit targets

| File | What to touch |
|---|---|
| `index.html` | Framework picker rows, example nouns, Use hrefs, Changed line, stack only if a new *job* appeared |
| `README.md` | Doc link table if a URL moved |
| `data/link-report.json` | Leave to CI unless you re-ran the checker |

## Done when

- Link check exits 0
- PR body lists what changed and what you deliberately left alone
- Public card still has no editor-facing notes
