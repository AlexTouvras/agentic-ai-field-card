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
| **Thursday GitHub Action (12:00 UTC)** | Discovers tools, checks links, opens a weekly PR. Skips if this week already shipped. No Slack ping. |
| **Friday Cursor Automation (17:00 local)** | Edits the card when earned; leaves the PR open |
| **Friday review agent (18:00 local)** | Publishes or keeps the previous card |
| **Slack #orbit** | One laconic FYI per card after review (Review / Considered / Changed / Online + Check card). Open / Approve / Decline only if the review agent missed |
| **Mon watchdog** | If Friday review never applied, posts Open / Approve / Decline (no Saturday run) |
| **Broken-link issue** | Opens a labeled issue when Use/framework URLs fail |

CI uses only `GITHUB_TOKEN` for discovery. A review agent publishes or keeps the previous card. You do not need to commit for a weekly refresh.

`Apply review` is the publish/keep-previous switch. Slack Approve links are backup if that agent misses.

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
