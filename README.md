# Agentic AI Field Card

Standalone one-pager: [`index.html`](./index.html)

**Live:** after Pages is enabled → `https://alextouvras.github.io/agentic-ai-field-card/`

Public artifact only. Editor / maintenance notes live **here** and under `docs/`, not on the card.

## Use across channels

| Channel | How |
|---|---|
| **Browser / site** | GitHub Pages URL, or host `index.html` anywhere static |
| **PDF** | Open → Print / PDF (landscape A4) |
| **LinkedIn** | Share the Pages URL; caption can reuse the H1 + lede |
| **Email / Slack** | Attach PDF or paste link |

## Automation (keeps the HTML honest)

| Piece | What it does |
|---|---|
| **Friday GitHub Action (12:00 UTC)** | Discovers frameworks/tools, checks doc links, bumps stamp, opens a **discovery PR** — **no vendor LLM**, no Slack Approve yet |
| **Friday Cursor Automation (17:00 local)** | Judges update vs no-change, edits `index.html` when earned, writes `Decision:` + `## Summary`, triggers Slack notify |
| **Saturday health check (08:00 UTC)** | Opens `field-card-judgment` issue if the weekly PR still lacks a `Decision:` line |
| **Slack #orbit Approve** | Preview of proposed HTML + signed Approve/Skip (Orbit confirm page). Approve squash-merges field-card **and** syncs `index.html` into Orbit `public/field-card/` so alextouvras.com matches Pages |
| **Broken-link issue** | Opens a labeled issue when Use/framework URLs fail |

Long-horizon process (quarterly ontology, what not to automate): [`docs/durability.md`](./docs/durability.md).

CI uses only `GITHUB_TOKEN` for discovery. Judgment runs in Cursor Cloud Automation. Approve is **not** auto-merge from the agent — you confirm in Slack (confirm page first, like essays).

### Secrets (field-card repo)

Copy from Orbit / Vercel as needed:

| Secret | Purpose |
|---|---|
| `SLACK_ORBIT_WEBHOOK_URL` (or `SLACK_WEBHOOK_URL`) | Incoming webhook for #orbit |
| `WEEKLY_WRITE_SECRET` or `CRON_SECRET` or `FIELD_CARD_ACTION_SECRET` | HMAC for Approve/Skip tokens (must match Orbit) |

### Secrets (Orbit / Vercel)

| Secret | Purpose |
|---|---|
| `GITHUB_TOKEN` or `FIELD_CARD_GITHUB_TOKEN` | Must be able to merge/close PRs on `AlexTouvras/agentic-ai-field-card` |
| Same signing secret as above | Verify Approve/Skip tokens |

Manual Slack notify:

```bash
gh workflow run "Notify Slack approve" -f pr_number=1
```

## What stays vs what churns

| Stable (edit rarely) | Churn zone (weekly OK) |
|---|---|
| 4-layer stack | Framework picker rows |
| Problem → use logic | Concrete product names in examples |
| Rules vs skills | Version stamp + Changed line + doc URLs |
| Ladder, anti-patterns, kill switch | — |

New protocols earn a **new layer** only if they solve a new job (knowledge / control / tools / peers / behavior). A renamed framework is a picker-row swap, not a redesign.

## Framework picker guidance

| Constraint | Typical pick |
|---|---|
| Control / HITL / durable state | LangGraph |
| Speed to role-based demo | CrewAI |
| RAG / data-first | LlamaIndex |
| Azure / .NET | MS Agent Framework |
| Handoffs or Anthropic-native | OpenAI / Claude SDKs |
| Schema-first typed Python | Pydantic AI |

## Doc links (Use column + frameworks)

| Label | Destination |
|---|---|
| RAG | https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview |
| MCP | https://modelcontextprotocol.io/ |
| Direct tools | https://platform.openai.com/docs/guides/function-calling |
| Workflow / Agent | https://www.anthropic.com/engineering/building-effective-agents |
| Rules | https://cursor.com/docs/rules |
| Skill | https://cursor.com/docs/skills |
| Human gate | https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop |
| Fine-tune | https://platform.openai.com/docs/guides/fine-tuning |
| A2A | https://a2a-protocol.org/ |
| Evals | https://platform.openai.com/docs/guides/evals |
| LangGraph | https://langchain-ai.github.io/langgraph/ |
| CrewAI | https://docs.crewai.com/ |
| LlamaIndex | https://docs.llamaindex.ai/ |
| MS Agent Framework | https://learn.microsoft.com/en-us/agent-framework/overview/ |
| OpenAI Agents SDK | https://openai.github.io/openai-agents-python/ |
| Claude Agent SDK | https://code.claude.com/docs/en/agent-sdk/overview |
| Pydantic AI | https://ai.pydantic.dev/ |

## Weekly refresh checklist (human)

1. Merge or amend the Monday PR after the content pass
2. Swap framework rows if the field moved
3. Refresh example nouns if needed; keep the problem column intact
4. Leave ladder and anti-patterns alone unless the pattern itself changed
